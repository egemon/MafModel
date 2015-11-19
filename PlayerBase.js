define(
    'model/PlayerBase',
[
], function (
) {
    console.log('[PlayerBase] init:', arguments);
    var PlayerBase = function () {
        this.Players = [];

        this.generateId = function () {
          return new Date();
        };

        this.addPlayer = function (Player) {
            this.Players.push(Player);
        };


    };
    var singelton = singelton || new PlayerBase();
    return singelton;
} );