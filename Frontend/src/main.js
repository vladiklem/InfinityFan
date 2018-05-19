var API = require('./API');
var Random = require("random-js");
var random = new Random(Random.engines.mt19937().autoSeed());
var Heroes;
var contestMembers = [];
var op1, op2;
var P1, P2;
var id1,id2,winId,outputId;
var left_node = document.getElementById('left-img');
var right_node = document.getElementById('right-img');
var list = document.getElementById('res-list');
var card = document.getElementById('example');
var wins = [];
var loses = [];
var resList = [];
var userRat = [];

var battleLog = {
    id_1:0,
    id_2:0,
    winnerId:0
};

$(function () {
    chooseOpponents()
    $('#left-img').click(function () {
        battleLog.id_1 = op1;
        battleLog.id_2 = op2;
        battleLog.winnerId = op1;
        API.addFightRes(battleLog , function (err, data) {
            if (!err) {
                if (data.success) {
                    console.log("S");
                }else{
                    console.log("Error!");
                }
            }
        });
        chooseOpponents();
    });
    $('#right-img').click(function () {
        battleLog.id_1 = op1;
        battleLog.id_2 = op2;
        battleLog.winnerId = op2;
        API.addFightRes(battleLog , function (err, data) {
            if (!err) {
                if (data.success) {
                    console.log("S");
                }else{
                    console.log("Error!");
                }
            }
        });
        chooseOpponents();
    });
    $('.statistics').click(function () {
        document.getElementById('con1').style.visibility = "hidden";
        document.getElementById('con1').style.opacity = "0";
        document.getElementById('con1').style.marginTop = "-700px";
        document.getElementById('con1').style.paddingBottom = "130px";
        document.getElementById('con2').style.visibility = "visible";
        document.getElementById('con2').style.opacity = "1";
        var elements = document.getElementsByClassName('removeme');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
        wins = [];
        loses = [];
        userRat = [];
        resList = [];
        API.getHeroesList(function (err, data) {
            for(var i = 0;i<data.length;i++){
                wins.push(0);
                loses.push(0);
                userRat.push(400);
                resList.push(data[i].id);
            }
        })
        API.getResultsList(function (err, results) {
            for(var i = 0;i<results.length;i++){
                id1 = results[i].id_1;
                id2 = results[i].id_2;
                winId = results[i].winnerId
                wins[winId] += 1;
                P1 = (1.0 / (1.0 + Math.pow(10, ((userRat[id1]-userRat[id2]) / 400))));
                P2 = (1.0 / (1.0 + Math.pow(10, ((userRat[id2]-userRat[id1]) / 400))));

                if (id1 == winId) {
                    loses[id2] += 1;
                    userRat[id1] = userRat[id1] + 40 + (-40 * P1);
                    userRat[id2] = userRat[id2] - 40 * P2;
                } else {
                    loses[id1] += 1;
                    userRat[id2] = userRat[id2] + 40 + (-40 * P2);
                    userRat[id1] = userRat[id1] - 40 * P1;
                }
            }
            var z = 0;
            API.getHeroesList(function (err, data) {
                for(var i = 0;i<resList.length-1;i++){
                    for(var j = i+1;j<resList.length;j++){
                        if (userRat[i]<userRat[j]){
                            z = resList[i];
                            resList[i] = resList[j];
                            resList[j] = z;
                            z = userRat[i];
                            userRat[i] = userRat[j];
                            userRat[j] = z;
                        }
                    }
                }
                var output = randomResults(wins.length);
                for(var j =0;j<3; j++){
                    for(var i =0;i<resList.length;i++) {
                        if (resList[i] == output[j]){
                           outputId = i;
                        }
                    }
                    var res_node = card.cloneNode(true);
                    res_node.getElementsByClassName('hero-name')[0].innerHTML = data[resList[outputId]].name;
                    res_node.getElementsByClassName("hero-ur")[0].innerHTML = "User Rating: " + userRat[outputId].toFixed(2);
                    res_node.getElementsByClassName("wloses")[0].innerHTML = "Wins/Loses : " + wins[resList[outputId]] + '/' + loses[resList[outputId]];
                    res_node.style.display = 'block';
                    res_node.classList.add('removeme');
                    res_node.getElementsByClassName("list-img")[0].style.backgroundImage = "url(assets/heroe_avater/" + data[resList[outputId]].img + ")";
                    list.appendChild(res_node);
                }
            })
        })

    });
    $('.main-page').click(function () {
        document.getElementById('con2').style.visibility = "hidden";
        document.getElementById('con2').style.opacity = "0";
        document.getElementById('con1').style.marginTop = "0px";
        document.getElementById('con1').style.visibility = "visible";
        document.getElementById('con1').style.opacity = "1";
        var elements = document.getElementsByClassName('removeme');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    });
});

function chooseOpponents() {
    API.getHeroesList(function (err, data) {
        Heroes = data;
        contestMembers = randomOpponents(Heroes.length);
        op1 = contestMembers[0];
        op2 = contestMembers[1];
        for (var i = 0;i<Heroes.length;i++){
            if(Heroes[i].id === op1){
                left_node.style.backgroundImage = "url(assets/heroe_avater/" + Heroes[i].img + ")";
                document.getElementById('desc-left').innerHTML = Heroes[i].name;
            }
            if (Heroes[i].id === op2) {
                right_node.style.backgroundImage = "url(assets/heroe_avater/" + Heroes[i].img + ")";
                document.getElementById('desc-right').innerHTML = Heroes[i].name;
            }
        }
    });
}

function randomOpponents(max) {
    var x1 = random.integer(0, max-1);
    var x2 = x1;
    while (x1==x2){
        x2 = random.integer(0, max-1);
    }
    var res = [x1 , x2];
    return res;
}

function randomResults(max) {
    var y1 = random.integer(0, max-1);
    var y2 = y1;
    while(y1==y2){
        y2 = random.integer(0, max-1);
    }
    var y3 = y2;
    while(y1 == y3 || y3 == y2){
        y3 = random.integer(0, max-1);
    }
    var res2 = [y1 , y2 ,y3];
    return res2;
}