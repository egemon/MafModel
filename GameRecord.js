define(
    'model/GameRecord',
[
    'model/Player',
    'model/PlayerLine',
], function (
    Player,
    PlayerLine
) {
    console.log('[GameRecord] init started with ', arguments);

    var GameRecord = function (dataArray) {
        var GameRecordLink = this;

        this.saveMetaData = function (metadata) {
            this.metadata = {};
            metadata.forEach(function (el, i) {
               GameRecordLink.metadata[el.name] = el.value;
            });
        };

        this.savePlayerLines = function (playersData) {
            this.playerLines = [];
            for (var i = 0; i < 10; i++) {
                this.playerLines.push(new PlayerLine());
            }

            playersData.forEach(function (el, i) {
                if (!el.value) {return;}
                var nameArray = el.name.split('_');
                var playerNumber = nameArray[0];
                var currentPlayerLine = GameRecordLink.playerLines[playerNumber - 1];
                switch ( nameArray[1] ) {
                    case 'Days':
                        var dayNumber = nameArray[2];
                        var info = nameArray[3];
                        currentPlayerLine.setDayInfo(dayNumber, info, el.value);
                    break;

                    default:
                        currentPlayerLine[nameArray[1]] = el.value;
                }
            });
        };

        this.saveMetaData(dataArray.splice(0, 5));
        this.savePlayerLines(dataArray);
    };

    return GameRecord;
} );
