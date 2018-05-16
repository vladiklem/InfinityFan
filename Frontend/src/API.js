function backendGet(url, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

function backendPost(url, data, callback) {
    $.ajax({
        url: url,
        type: 'POST',
        contentType : 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

exports.getHeroesList = function(callback) {
    backendGet('/api/get-heroes/', callback);
};

exports.getResultsList = function(callback) {
    backendGet('/api/get-results-list/', callback);
};

exports.addFightRes = function (res, callback) {
    backendPost('/api/add-fight-res/', res, callback);
};
