var LocalGameStorage = require('../model/LocalGameStorage');
var RatingRules = require('../model/RatingRules.json');

console.log('[RatingBase] init:');
var RatingBase = function () {
    this.rulesObject = RatingRules;
    console.log('[M-RatingBase] rulesObject = ', this.rulesObject);
    //period, RatingRules, GameRecords-> RatingObject
    this.calculateRating = function (games) {
        console.log('[RatingBase] calculateRating()');
        games = this.filterNotCompletedGames(games);
        var RatingObject = {};
        for (var i = 0; i < games.length; i++) {
            for (var j = 0; j < this.rulesObject.rules.length; j++) {
                this.applyRuleToRecord(games[i], this.rulesObject.rules[j], RatingObject);
            }
            console.log('[RatingBase] calculateRating() RatingObject = ', RatingObject);
            for (var k = 0; k < games[i].playerLines.length; k++) {
                RatingObject[games[i].playerLines[k].nick].gameNumber = RatingObject[games[i].playerLines[k].nick].gameNumber ?
                 ++RatingObject[games[i].playerLines[k].nick].gameNumber : 1;
                if (games[i].playerLines[k].BP) {
                    RatingObject[games[i].playerLines[k].nick].BP = RatingObject[games[i].playerLines[k].nick].BP ? ++RatingObject[games[i].playerLines[k].nick].BP : 1;
                }
                if (games[i].playerLines[k].BR) {
                    RatingObject[games[i].playerLines[k].nick].BR = RatingObject[games[i].playerLines[k].nick].BR ? ++RatingObject[games[i].playerLines[k].nick].BR : 1;
                }
            }
        }
        console.log('[RatingBase] calculateRating() RatingObject = ', RatingObject);
        var RatingArray = this.sortPlayersToArray(RatingObject, "average");
        console.log('[RatingBase] calculateRating() RatingArray = ', RatingArray);
        return RatingArray;
    };

    this.applyRuleToRecord = function (GameRecord, RatingRule, RatingObject) {
        console.log('[RatingBase] applyRuleToRecord()', arguments);
        var PlayerLines = GameRecord.playerLines;
        if (!RatingRule.condition.metadata || (GameRecord.metadata && this.isMetadataCorrect(GameRecord.metadata, RatingRule.condition.metadata))) {
            for (var i = 0; i < PlayerLines.length; i++) {
                var player = PlayerLines[i];
                if (!RatingRule.condition.player || this.isPlayerCorrect(player, RatingRule.condition.player)) {
                    if (RatingObject[player.nick]) {
                        RatingObject[player.nick].sum += RatingRule.value;
                    } else {
                        RatingObject[player.nick] = {};
                        RatingObject[player.nick].sum = RatingRule.value;
                    }
                }
            }
        }
    };

    this.isPlayerCorrect = function (player, playerCondition) {
        // console.log('[RatingBase] isPlayerCorrect()', arguments);

        var isTrue = true;
        for(var key in playerCondition){
            var value = playerCondition[key];
            isTrue = isTrue && player[key] === value;
        }
        return isTrue;
    };

    this.isMetadataCorrect = function (metadata, ruleMetadata) {
        // console.log('[RatingBase] isMetadataCorrect()', arguments);

        var isTrue = true;
        for(var key in ruleMetadata){
            var val = ruleMetadata[key];
            isTrue = isTrue && metadata[key] === val;
        }
        return isTrue;
    };

    this.sortPlayersToArray = function (RatingObject, byString) {
        console.log('[RatingBase] sortPlayersToArray()', arguments);
        if (byString === 'average') {
            var array = [];
            var value = '';
            for(var nick in RatingObject){
                value = RatingObject[nick];
                value.nick = nick;
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
        console.log('[RatingBase] filterNotCompletedGames()', arguments);
        return games && games.filter(function(game) {
            return this.isGameComplete(game);
        }.bind(this));
    };

    this.isGameComplete = function (game) {
        // console.log('[RatingBase] isGameComplete()', arguments);

        var isTrue = true;
        for (var i = 0; i < game.playerLines.length; i++) {
            isTrue = game.playerLines[i].nick && game.playerLines[i].role;
        }
        return isTrue &&
            game.metadata.date &&
            game.metadata.win;
    };

};

module.exports = new RatingBase(LocalGameStorage);