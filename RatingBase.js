var PlayerLine = require('../model/PlayerLine');
var Player = require('../model/Player');
var LocalGameStorage = require('../model/LocalGameStorage');
var RatingRules = require('../model/RatingRules.json');

console.log('[RatingBase] init:', arguments);
var RatingBase = function () {
    this.rulesObject = RatingRules;
    console.log('[M-RatingBase] rulesObject = ', this.rulesObject);
    //period, RatingRules, GameRecords-> RatingObject
    this.calculateRating = function (games) {
        console.log('Rating calculation started with games');
        console.log(games);
        games = this.filterNotCompletedGames(games);
        var RatingObject = {};
        for (var i = 0; i < games.length; i++) {
            for (var j = 0; j < this.rulesObject.rules.length; j++) {
                this.applyRuleToRecord(games[i], this.rulesObject.rules[j], RatingObject);
            }
            for (var k = 0; k < games[i].playerLines.length; k++) {
                RatingObject[games[i].playerLines[k].name].gameNumber = RatingObject[games[i].playerLines[k].name].gameNumber ?
                 ++RatingObject[games[i].playerLines[k].name].gameNumber : 1;
                if (games[i].playerLines[k].BP) {
                    RatingObject[games[i].playerLines[k].name].BP = RatingObject[games[i].playerLines[k].name].BP ? ++RatingObject[games[i].playerLines[k].name].BP : 1;
                }
                if (games[i].playerLines[k].BR) {
                    RatingObject[games[i].playerLines[k].name].BR = RatingObject[games[i].playerLines[k].name].BR ? ++RatingObject[games[i].playerLines[k].name].BR : 1;
                }
            }
        }
        console.log('[RatingBase] calculateRating() RatingObject = ', RatingObject);
        var RatingArray = this.sortPlayersToArray(RatingObject, "average");
        console.log('[RatingBase] calculateRating() RatingArray = ', RatingArray);
        return RatingArray;
    };

    this.applyRuleToRecord = function (GameRecord, RatingRule, RatingObject) {
        console.log('[RatingBase] game adding to rating');
        var PlayerLines = GameRecord.playerLines;
        if (!RatingRule.condition.metadata || (GameRecord.metadata && this.isMetadataCorrect(GameRecord.metadata, RatingRule.condition.metadata))) {
            for (var i = 0; i < PlayerLines.length; i++) {
                var player = PlayerLines[i];
                if (!RatingRule.condition.player || this.isPlayerCorrect(player, RatingRule.condition.player)) {
                    if (RatingObject[player.name]) {
                        RatingObject[player.name].sum += RatingRule.value;
                    } else {
                        RatingObject[player.name] = {};
                        RatingObject[player.name].sum = RatingRule.value;
                    }
                }
            }
        }
    };

    this.isPlayerCorrect = function (player, playerCondition) {
        var isTrue = true;
        for(var key in playerCondition){
            var value = playerCondition[key];
            isTrue = isTrue && player[key] === value;
        }
        return isTrue;
    };

    this.isMetadataCorrect = function (metadata, ruleMetadata) {
        var isTrue = true;
        for(var key in ruleMetadata){
            val = ruleMetadata[key];
            isTrue = isTrue && metadata[key] === val;
        }
        return isTrue;
    };

    this.sortPlayersToArray = function (RatingObject, byString) {
        if (byString === 'average') {
            var array = [];
            var value = '';
            var player = {};
            for(var nick in RatingObject){
                value = RatingObject[nick];
                value.name = nick;
                array.push(value);
            }
            return array.sort(function(a, b){
                return b.sum / b.gameNumber - a.sum / a.gameNumber;
            });
        } else {
            console.warn('I don;t know this sort!');
        }
    };

    this.filterNotCompletedGames = function (games) {
        return games && games.filter(function(game) {
            return this.isGameComplete(game);
        }.bind(this));
    };

    this.isGameComplete = function (game) {
        var isTrue = true;
        for (var i = 0; i < game.playerLines.length; i++) {
            isTrue = game.playerLines[i].name && game.playerLines[i].role;
        }
        return isTrue &&
            game.metadata.date &&
            game.metadata.win;
    };

};

module.exports = new RatingBase(LocalGameStorage);