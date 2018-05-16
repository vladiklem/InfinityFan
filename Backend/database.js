var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/BattlesLog');
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});

var one_battle = new mongoose.Schema({
    id_1: {type: Number},
    id_2: {type: Number},
    winnerId: {type: Number},
});

var One_Battle = mongoose.model('one_battle', one_battle);

exports.One_Battle = One_Battle;