var fs = require('fs');
//TODO timeout+cache

var cache = {};

var localStorage = {
    length: 0,
    keys: [],

    init: function () {
        var games = JSON.parse(fs.readFileSync('games/games.json', 'utf8'));
        this.length = games.length;
        var i = 0;
        for (var key in games) {
            this.keys[i++] = games[key];
        };
    },

    getItem: function (id) {
        console.log('[localStorage-M] getItem', arguments);

        var games = JSON.parse(fs.readFileSync('games/games.json', 'utf8'));
        console.log('games = ', games);
        return games[id];
    },

    setItem: function (id, str) {
        console.log('[localStorage-M] setItem', arguments);
        var games = JSON.parse(fs.readFileSync('games/games.json', 'utf8'));
        console.log('[localStorage-M] setItem games in lS = ', games);
        games[id] = str;
        console.log('[localStorage-M] setItem games in lS after set = ', games);
        fs.writeFileSync('games/games.json', JSON.stringify(games), 'utf8');
    },

    key: function (i) {
        this.init();
        return this.keys[i];
    }
};

localStorage.init();
module.exports = localStorage;