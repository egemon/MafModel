var fs = require('fs');
//TODO timeout+cache

var cache = {};

var localStorage = {
    length: 0,
    keys: [],

    init: function () {
        var games = JSON.stringify(fs.readFileSync('games/games.json', 'utf8'));
        this.length = games.length; 
        var i = 0;   
        for (var key in games) {
            this.keys[i++] = games[key];
        };
    },

    getItem: function (id) {

        var games = JSON.stringify(fs.readFileSync('games/games.json', 'utf8'))
        console.log('games = ', games);
        return games[id];
    },

    setItem: function (id, str) {
        var games = JSON.stringify(fs.readFileSync('games/games.json', 'utf8'))
        games[id] = str;
        fs.writeFileSync('games/games.json', games, 'utf8');
    },

    key: function (i) {
        this.init();
        return this.keys[i];
    }
};

localStorage.init();
module.exports = localStorage;