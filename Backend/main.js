var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();

function configureEndpoints(app) {
    var api = require('./api');

    app.get('/api/get-heroes/', api.getHeroes);
    app.get('/api/get-results-list/', api.getResultsList);

    app.post('/api/add-fight-res/', api.addFightRes);

    app.get('/',function (req, res) {
        res.render('mainPage');
    });

    app.use(express.static(path.join(__dirname, '../Frontend/www')));
}

function startServer(port) {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(morgan('dev'));

    app.use(bodyParser.json({limit: '60mb'}));
    app.use(bodyParser.urlencoded({ extended: false}));

    configureEndpoints(app);

    app.listen(port,function () {
        console.log("Server start listening on port " + port);
    });
}

exports.startServer = startServer;