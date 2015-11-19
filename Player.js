define(
    'model/Player',
    ['model/PlayerBase'],
    function (PlayerBase) {
        console.log('[Player] init: ', arguments);
        function Player (nick, birthday, phone, vk, comfortableTime) {
            this.id = PlayerBase.generateId();
            this.nick = nick;

            this.gameHistory = []; // [GameRecord, GameRecord, ...]

            this.birthday = birthday;
            this.presents = [];
            this.phone = phone;
            this.vk = vk;
            this.comfortableTime = comfortableTime;
            PlayerBase.addPlayer(this);
        }

        Player.prototype.addGameToHistory = function(GameRecord) {
            this.gameHistory.push(GameRecord);
        };

        Player.prototype.getGameHistory = function() {
            return this.gameHistory;
        };

        return Player;
    }
);