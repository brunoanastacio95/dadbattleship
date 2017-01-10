"use strict";
var User = (function () {
    function User(_id, username, email, totalVictories, totalScore, token, password, passwordConfirmation, playingStatus) {
        this._id = _id;
        this.username = username;
        this.email = email;
        this.totalVictories = totalVictories;
        this.totalScore = totalScore;
        this.token = token;
        this.password = password;
        this.passwordConfirmation = passwordConfirmation;
        this.playingStatus = playingStatus;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map