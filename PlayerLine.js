var PlayerLine = function () {
    this.Days = [];

    this.setDayInfo = function (dayNumber, info, value) {
        if (!this.Days[dayNumber - 1]) {
            this.Days[dayNumber - 1] = {};
        }
        this.Days[dayNumber - 1][info] = value;
    };


};

module.exports = PlayerLine;
