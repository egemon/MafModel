var fs = require('fs');
//TODO timeout+cache

var PATH = 'data-base/games/';

var localStorage = {
    length: 0,
    keys: [],
    initLocalStorage: function() {
        console.log('[localStorage] initLocalStorage()', arguments);
        var gameFiles = fs.readdirSync(PATH);
        this.length = gameFiles.length;
        for (var i = 0; i < gameFiles.length; i++) {
            this.keys[i] = gameFiles[i].replace('.json', '');
        }
    },

    init: function () {
        console.log('[localStorage-M] init() ');
        this.initLocalStorage();
        fs.watch(PATH, {recursive: true}, this.initLocalStorage.bind(this));
    },

    getItem: function (id) {
        console.log('[localStorage-M] getItem', arguments);
        var game;
        try {
            game = JSON.parse(fs.readFileSync(PATH + id + '.json', 'utf8'));
        } catch(err) {
            console.warn('[localStorage-M] getItem error', err);
            return false;
        }
        return game;
    },

    setItem: function (id, str) {
        console.log('[localStorage-M] setItem', arguments);
        var game = {};
        try {
            game = JSON.parse(fs.readFileSync(PATH + id + '.json', 'utf8'));
            console.warn('[localStorage-M] Item already exists! ', id);
            fs.writeFileSync(PATH + id + '.json', JSON.stringify(str, null, 4), 'utf8');
        } catch(e) {
            fs.writeFileSync(PATH + id + '.json', JSON.stringify(str, null, 4), 'utf8');
        }
    },

    deleteItem: function (id) {
        var promise = {
            callback: null,
            resolve: function (data) {
                if (typeof this.callback === 'function') {
                    this.callback(data);
                } else {
                    console.warn('[dataBase] Promise doesn"t work!');
                }
            },
            when: function (callback) {
                this.callback = callback;
            }
        };
        fs.unlink(PATH + id + '.json', function (err) {
            console.log('[localStorage] deleteItem() ', arguments);
            if (err) {
                promise.resolve(false);
            } else {
                promise.resolve(true);
            }
        })
        return promise;
    },

    key: function (i) {
        // this.init();
        return this.keys[i];
    }
};

localStorage.init();
module.exports = localStorage;