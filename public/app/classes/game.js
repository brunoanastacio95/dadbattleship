"use strict";
var Game = (function () {
    function Game(_id, ownerId, startDate, endDate, winnerId, finish, players, gameStatus) {
        this._id = _id;
        this.ownerId = ownerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.winnerId = winnerId;
        this.finish = finish;
        this.players = players;
        this.gameStatus = gameStatus;
    }
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map