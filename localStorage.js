var fs = require('fs');
//TODO timeout+cache

var cache = {};
var PATH = 'data-base/games/';
var localStorage = {
    length: 0,
    keys: [],

    init: function () {
        var gameFiles = fs.readdirSync(PATH);
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
            game = JSON.parse(fs.readFileSync(PATH + id + '.json', 'utf8'));
        } catch(err) {
            console.warn('[localStorage-M] getItem error', err);
        }
        console.log('game = ', game);
        return JSON.parse(game);
    },

    setItem: function (id, str) {
        console.log('[localStorage-M] setItem', arguments);
        var game = {};
        try {
            game = JSON.parse(fs.readFileSync(PATH + id + '.json', 'utf8'));
            console.warn('[localStorage-M] Item already exists! ', id);
            fs.writeFileSync(PATH + id + '.json', JSON.stringify(str), 'utf8');
        } catch(e) {
            fs.writeFileSync(PATH + id + '.json', JSON.stringify(str), 'utf8');
        }
    },

    key: function (i) {
        // this.init();
        return this.keys[i];
    }
};

localStorage.init();
module.exports = localStorage;