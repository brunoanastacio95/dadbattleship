"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
var GameService = (function () {
    function GameService(http) {
        this.http = http;
    }
    GameService.prototype.newGame = function (user) {
        var options = this.buildHeaders(user.token);
        return this.http.post('http://localhost:7777/api/v1/games', { ownerId: user._id, finish: false, players: [{ player: user._id, score: 0 }], gameStatus: 'on hold' }, options)
            .map(function (res) {
            return res.json();
        })
            .catch(function (e) {
            console.log(e);
            return Rx_1.Observable.throw(e);
        });
    };
    GameService.prototype.findOnHoldGames = function (user) {
        var options = this.buildHeaders(user.token);
        var games = [];
        var err = false;
        return this.http.get('http://localhost:7777/api/v1/games', options)
            .map(function (res) {
            res.json().forEach(function (game) {
                err = false;
                if (game.gameStatus === 'on hold' && game.ownerId !== user._id.toString()) {
                    game.players.forEach(function (player) {
                        //   console.log("ids: " + player.player + "  |  " + user._id);
                        if (player.player === user._id) {
                            err = true;
                        }
                    });
                    if (!err) {
                        games.push(game);
                    }
                }
            });
            return games;
        })
            .catch(function (e) {
            console.log(e);
            return Rx_1.Observable.throw(e);
        });
    };
    GameService.prototype.findGamesByUser = function (user) {
        var options = this.buildHeaders(user.token);
        var games = [];
        return this.http.get('http://localhost:7777/api/v1/games', options)
            .map(function (res) {
            res.json().forEach(function (game) {
                if (game.ownerId === user._id.toString()) {
                    games.push(game);
                }
            });
            return games;
        })
            .catch(function (e) {
            console.log(e);
            return Rx_1.Observable.throw(e);
        });
    };
    GameService.prototype.updateGame = function (game, user) {
        console.log(user.username + " está a tentar entrar no jogo: " + game._id);
        var options = this.buildHeaders(user.token);
        var url = 'http://localhost:7777/api/v1/games/' + game._id;
        // console.log("URL: " + url);
        return this.http.put(url, JSON.stringify(game), options)
            .map(function (res) {
            return res.json();
        })
            .catch(function (e) {
            console.log(e);
            return Rx_1.Observable.throw(e);
        });
    };
    GameService.prototype.deleteGame = function (game, user) {
        var options = this.buildHeaders(user.token);
        var url = 'http://localhost:7777/api/v1/games/' + game._id;
        return this.http.delete(url, options)
            .map(function (res) {
            return res.json();
        })
            .catch(function (e) {
            console.log(e);
            return Rx_1.Observable.throw(e);
        });
    };
    GameService.prototype.buildHeaders = function (token) {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'bearer ' + token);
        headers.append('Content-Type', 'application/json');
        return new http_1.RequestOptions({ headers: headers });
    };
    return GameService;
}());
GameService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map