var db = require('./database');
var One_Battle = db.One_Battle;
var Heroes = require('./data/Heroes');

exports.getHeroes = function (req, res) {
    res.send(Heroes);
};

exports.getResultsList = function (req, res) {
    One_Battle.find(function (err, results) {
        res.send(results)
    })
}

exports.addFightRes = function (req, res) {
    var id_1 = req.body.id_1;
    var id_2 = req.body.id_2;
    var winner = req.body.winnerId;
    var newRow = new One_Battle({
        id_1:id_1,
        id_2:id_2,
        winnerId:winner
    });
    // Видалення усіх коментарів
     One_Battle.remove(function (err, comments) {
       console.log("results removed")
    });

    newRow.save(function (err) {
        if (!err) {
            res.send({
                success: true
            });
        }
    })
};
