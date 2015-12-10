var fs = require('fs');
//TODO timeout+cache

var cache = {};

var localStorage = {
    length: 0,
    keys: [],

    init: function () {
        var gameFiles = fs.readdirSync('data-base/games');
        console.log('[localStorage-M] init() gameFiles = ', gameFiles);
        this.length = gameFiles.length;
        for (var i = 0; i < gameFiles.length; i++) {
            this.keys[i] = gameFiles[i].replace('.json', '');
        }
        console.log('[localStorage-M] init() gameFiles = ', this.keys);
    },

    getItem: function (id) {
        console.log('[localStorage-M] getItem', arguments);
        var game;
        try {
            game = JSON.parse(fs.readFileSync('games/' + id + '.json', 'utf8'));
        } catch(err) {
            console.warn('[localStorage-M] getItem error', err);
        }
        console.log('games = ', game);
        return game;
    },

    setItem: function (id, str) {
        console.log('[localStorage-M] setItem', arguments);
        var game = {};
        try {
            game = JSON.parse(fs.readFileSync('games/' + id + '.json', 'utf8'));
            console.warn('[localStorage-M] Item already exists! ', id);
            fs.writeFileSync('games/' + id + '.json', JSON.stringify(str), 'utf8');
        } catch(e) {
            fs.writeFileSync('games/' + id + '.json', JSON.stringify(str), 'utf8');
        }
    },

    key: function (i) {
        // this.init();
        return this.keys[i];
    }
};

localStorage.init();
module.exports = localStorage;