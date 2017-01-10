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
var websocket_service_1 = require("../websocket/websocket.service");
var router_1 = require("@angular/router");
var game_service_1 = require("../services/game.service");
var auth_service_1 = require("../services/auth.service");
var LobbyComponent = (function () {
    function LobbyComponent(websocketService, game, auth, router) {
        this.websocketService = websocketService;
        this.game = game;
        this.auth = auth;
        this.router = router;
        this.error = false;
        this.gameCreated = false;
        this.myGames = [];
        this.onHoldGames = [];
    }
    LobbyComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.findOnHoldGames();
        this.findMyGames();
        this.websocketService.getNewRoom().subscribe(function (m) {
            _this.findOnHoldGames();
            _this.findMyGames();
        });
        this.websocketService.getJoinOnRoom().subscribe(function (m) {
            console.log("JOIN: " + m);
            _this.findMyGames();
            _this.findOnHoldGames();
        });
        this.websocketService.getGameStart().subscribe(function (m) {
            console.log("JOGO COMEÇOU AAAAA : " + m);
            _this.router.navigateByUrl('/board/' + m);
        });
        this.websocketService.getRoomDeleted().subscribe(function (m) {
            console.log("quase que apaguei");
            _this.findOnHoldGames();
            _this.findMyGames();
        });
    };
    LobbyComponent.prototype.newGame = function () {
        var _this = this;
        // console.log("Creating new game, user: " + this.auth.getCurrentUser().username);
        this.game.newGame(this.auth.getCurrentUser()).subscribe(function (res) {
            if (res !== 'No game data') {
                _this.message = 'Game created with success!';
                _this.gameCreated = true;
                //id do jogo criado = res._id
                // console.log("RES: " + res._id /* this.message*/);
                _this.websocketService.newRoom({ room: 'room' + res._id, userId: _this.auth.getCurrentUser()._id, username: _this.auth.getCurrentUser().username });
                console.log("Websocket channel => " + "room");
                _this.findMyGames();
            }
            else {
                _this.error = true;
                _this.gameCreated = false;
            }
            setTimeout(function () {
                _this.message = '';
                _this.gameCreated = false;
            }, 1000);
        });
    };
    LobbyComponent.prototype.joinGame = function (i) {
        var _this = this;
        //  console.log("Jogo: " + this.onHoldGames[i]._id + "  value i: " + i);
        //   console.log("Nr players: " + this.onHoldGames[i].players.length);
        if (this.onHoldGames[i].players.length == 4) {
            this.error = true;
            console.log(this.message = 'Lobby full');
            return;
        }
        this.game.findOnHoldGames(this.auth.getCurrentUser()).subscribe(function (games) {
            if (games.length !== 0) {
                _this.onHoldGames = games;
                _this.onHoldGames[i].players.push({ player: _this.auth.getCurrentUser()._id, score: 0 });
                _this.game.updateGame(_this.onHoldGames[i], _this.auth.getCurrentUser()).subscribe(function (r) { return console.log(); });
                console.log('Entrou no jogo: ' + _this.onHoldGames[i]._id);
                //enviar através de websocket que alguém entrou na partida
                _this.websocketService.joinRoom({ userId: _this.auth.getCurrentUser()._id, username: _this.auth.getCurrentUser().username, room: 'room' + _this.onHoldGames[i]._id });
                _this.findOnHoldGames();
            }
            else {
                _this.error = true;
                console.log(_this.message = 'Não foi possivel entrar em jogo');
            }
        });
    };
    LobbyComponent.prototype.cancelGame = function (i) {
        console.log("delete game: " + this.myGames[i]._id);
        /*  this.myGames[i].gameStatus = 'canceled';
          this.game.updateGame(this.myGames[i], this.auth.getCurrentUser()).subscribe(r => console.log(r));*/
        this.game.deleteGame(this.myGames[i], this.auth.getCurrentUser()).subscribe(function (r) { return console.log(r); });
        this.websocketService.roomDeleted({ room: 'room' + this.myGames[i]._id });
        this.findMyGames();
    };
    LobbyComponent.prototype.findMyGames = function () {
        var _this = this;
        this.game.findGamesByUser(this.auth.currentUser).subscribe(function (r) {
            _this.myGames = r;
        });
    };
    LobbyComponent.prototype.findOnHoldGames = function () {
        var _this = this;
        this.game.findOnHoldGames(this.auth.currentUser).subscribe(function (r) {
            _this.onHoldGames = r;
        });
    };
    LobbyComponent.prototype.startGame = function (i) {
        console.log("Start game: " + this.myGames[i]._id);
        var room = 'room' + this.myGames[i]._id;
        //notificar todos os jogadores que o jogo começou
        this.myGames[i].gameStatus = 'playing';
        this.game.updateGame(this.myGames[i], this.auth.getCurrentUser()).subscribe(function (r) { return console.log(); });
        this.websocketService.notifyAllPlayerGameStarted({ message: 'Game Start!', room: room });
        //console.log("this is my data :  " + this.myGames[i]._id);
    };
    return LobbyComponent;
}());
LobbyComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'lobby',
        templateUrl: 'lobby.component.html'
    }),
    __metadata("design:paramtypes", [websocket_service_1.WebSocketService, game_service_1.GameService, auth_service_1.AuthService, router_1.Router])
], LobbyComponent);
exports.LobbyComponent = LobbyComponent;
//# sourceMappingURL=lobby.component.js.map