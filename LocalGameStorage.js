var GameRecord = require('../model/GameRecord');
var localStorage = require('../model/localStorage');
var LocalGameStorage = function () {

    //prefix for localStorage objects
    this.appIdentifier = 'MT';

    this.seasonMap = {
        'Winter': 1,
        'Spring': 2,
        'Summer': 3,
        'Autumn': 4
    };

    //GameRecord - object
    this.saveGame = function (GameRecord) {
        console.log('[LGS-M] saveGame()');
        var id = this.generateGameId(GameRecord.metadata);
        var isGameAlreadyExists = !!localStorage.getItem(id);
        if ( !isGameAlreadyExists
            // || (isGameAlreadyExists && confirm('Do your wanna override game?'))
           ) {
            localStorage.setItem(id, GameRecord);
        } else {
            // alert("Game wasn't saved! Please choose another date or number or Table.");
            console.warn('[LGS-M] This game already exists and now will be erased');
            localStorage.setItem(id, GameRecord);
        }
    };

    this.saveGameArray = function (games) {
        if (!games.length) {
            console.warn('[LGS-M] saveGameArray() it"s not array or there in no games!', games);
            return false;
        }
        for (var i = 0; i < games.length; i++) {
            this.saveGame(games[i]);
        }
        return true;
    };

    // filterObject = {
    //     id: "MT_2015-09-21_1_Baker Street",
    //     periodType: "month" || "year" || "season",
    //     period: "1" || "2015" || "4",
    //     playerNick: "Merlin"
    // }
    this.getGamesByFilter = function (filterObject) {
        console.log('[LocalGameStorage-M] getGamesByFilter()');
        if (filterObject === 'all') {
            filterObject = {};
        }

        var resultGames = [];
        if (!filterObject || !Object.keys(filterObject).length) {
            return this.getAllGames();
        }

        for (var key in filterObject) {
            switch(key) {
                case "id":
                return localStorage.getItem(filterObject.id);

                case "periodType":

                    if (filterObject.periodType === 'season' && this.isPeriodIncorrect(filterObject.period)) {
                        filterObject.period = this.seasonMap[filterObject.period];
                        if (this.isPeriodIncorrect(filterObject.period)) {
                            return [];
                        }
                    }
                    resultGames = this.getGamesByPeriod(filterObject.periodType, filterObject.period, filterObject.year);
                break;
                case "playerNick":
                    resultGames = resultGames ?
                        this.filterGamesByNick(resultGames, filterObject.playerNick) :
                        this.getGamesByNick(filterObject.playerNick);
                break;
                case "period":
                //prevent console warn
                break;
                default:
            }
        }

        return resultGames;
    };

    this.isPeriodIncorrect = function (period) {
        return Number.isNaN(+period);
    };

    //returns array of objects
    this.getGamesByPeriod = function (periodType, period, year) {
        console.log('[M-LocalGameStorage] getGamesByPeriod(): ', arguments);
        year = year || (new Date()).getUTCFullYear();
        period = period || year;
        var resultGamesArray = [];
        for (var i = 0; i < localStorage.length; i++) {
            var currentId = localStorage.key(i);
            if (currentId.indexOf(this.appIdentifier) < 0 ) {
                continue;
            }
            var dateArray = currentId.split('_')[1].split('-');

            var currentYear = +dateArray[0];
            if (currentYear != year) {
                continue;
            }

            var currentPeriod;
            switch(periodType) {
                case 'month':
                    currentPeriod = +dateArray[1];
                break;
                //winter is 1, autunmn is 4
                case 'season':
                    currentPeriod = parseInt((+dateArray[1] % 12) / 3) + 1;
                break;
                case 'year':
                    currentPeriod = currentYear;
                break;
            }

            if (currentPeriod == period) {
                resultGamesArray.push(localStorage.getItem(currentId));
            }
        }
        console.log('[M-LocalGameStorage] getGamesByPeriod():resultGamesArray= ', resultGamesArray);
        return resultGamesArray;
    };

    this.filterGamesByNick = function (resultGames, playerNick) {
        console.log('[M-LocalGameStorage] filterGamesByNick(): ', arguments);
        var filteredResult = [];
        for (var i = 0; i < resultGames.length; i++) {
            for (var j = 0; j < resultGames[i].playerLines.length; j++) {
                if (resultGames[i].playerLines[j].name == playerNick) {
                    filteredResult.push(resultGames[i]);
                }
            }
        }
        return filteredResult;
    };

    this.getGamesByNick = function (playerNick) {
        console.log('[M-LocalGameStorage] getGamesByNick(): ', arguments);
        return this.filterGamesByNick(this.getAllGames(), playerNick);
    };

    this.getAllGames = function () {
        console.log('[LocalGameStorage-M] getAllGames()');
        var resultGamesArray = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.split('_')[0] === this.appIdentifier) {
                resultGamesArray.push(localStorage.getItem(key));
            }
        }
        return resultGamesArray;
    };

    this.getPlayersNicks = function () {
        var Nicks = [];
        this.getAllGames().forEach(function (game) {
            if (game && game.playerLines) {
                game.playerLines.forEach(function (player) {
                    if (player.name && !(Nicks.some(function(el){return el == player.name;}))) {
                       Nicks.push(player.name);
                    }
                });
            }
        });
        return Nicks;
    };

    this.resetGameStorage = function () {
        localStorage.clear();
    };

    this.generateGameId = function (metadata) {
        console.log('[LocalGameStorage] generateGameId() ', arguments);
        return [this.appIdentifier, metadata.date, metadata.gameNumber, metadata.table].join('_');
    };

    this.createGameInfoObject = function (formArray) {
        return new GameRecord(formArray);
    };

    this.deleteGame = function (id) {
        console.log('[LocalGameStorage] deleteGame()', arguments);
        return localStorage.deleteItem(id);
    }

};

var singelton = singelton || new LocalGameStorage();
module.exports = singelton;
