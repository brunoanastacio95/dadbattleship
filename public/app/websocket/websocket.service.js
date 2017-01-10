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
var Observable_1 = require("rxjs/Observable");
var io = require("socket.io-client");
var WebSocketService = (function () {
    function WebSocketService() {
        if (!this.socket) {
            this.socket = io("http://" + window.location.hostname + ":7777");
        }
    }
    WebSocketService.prototype.sendChatMessage = function (message) {
        this.socket.emit('chat', message);
    };
    WebSocketService.prototype.getPlayersMessages = function () {
        return this.listenOnChannel('players');
    };
    WebSocketService.prototype.getChatMessages = function () {
        return this.listenOnChannel('chat');
    };
    WebSocketService.prototype.getNotes = function () {
        console.log("entrei auqi ");
        return this.listenOnChannel('notes');
    };
    WebSocketService.prototype.sendChatMessageOnRoom = function (message) {
        this.socket.emit('roomChat', message);
    };
    WebSocketService.prototype.sendNote = function (message) {
        this.socket.emit('notes', message);
    };
    WebSocketService.prototype.getChatMessagesOnRoom = function () {
        return this.listenOnChannel('roomChat');
    };
    WebSocketService.prototype.getAfundou = function () {
        return this.listenOnChannel('afundou');
    };
    WebSocketService.prototype.getDerrotado = function () {
        return this.listenOnChannel('derrotado');
    };
    // Extra Exercise - MOODLE
    WebSocketService.prototype.sendClickElementMessage = function (index) {
        this.socket.emit('clickElement', index);
    };
    WebSocketService.prototype.getBoardMessages = function () {
        return this.listenOnChannel('board');
    };
    WebSocketService.prototype.newRoom = function (message) {
        this.socket.emit('room', message); //room15651456146514
    };
    WebSocketService.prototype.getNewRoom = function () {
        return this.listenOnChannel('room');
    };
    WebSocketService.prototype.roomDeleted = function (message) {
        this.socket.emit('roomDeleted', message); //room15651456146514
    };
    WebSocketService.prototype.getRoomDeleted = function () {
        return this.listenOnChannel('roomDeleted');
    };
    WebSocketService.prototype.joinRoom = function (message) {
        this.socket.emit('join', message);
    };
    WebSocketService.prototype.getJoinOnRoom = function () {
        return this.listenOnChannel('join');
    };
    WebSocketService.prototype.notifyAllPlayerGameStarted = function (message) {
        this.socket.emit('game_start', message);
    };
    WebSocketService.prototype.getGameStart = function () {
        return this.listenOnChannel('game_start');
    };
    WebSocketService.prototype.getTipoNavio = function () {
        return this.listenOnChannel('tipoNavio');
    };
    WebSocketService.prototype.notifyAllPlayersImReady = function (message) {
        this.socket.emit('ready', message);
    };
    WebSocketService.prototype.getPlayersReady = function () {
        return this.listenOnChannel('ready');
    };
    WebSocketService.prototype.sendTiro = function (message) {
        this.socket.emit('tiro', message);
    };
    WebSocketService.prototype.getTiro = function () {
        return this.listenOnChannel('tiro');
    };
    WebSocketService.prototype.getAllPlayersReady = function () {
        return this.listenOnChannel('all_ready');
    };
    WebSocketService.prototype.sendGetTurn = function (message) {
        this.socket.emit('yourTurn', message);
    };
    WebSocketService.prototype.getTurn = function () {
        return this.listenOnChannel('yourTurn');
    };
    WebSocketService.prototype.listenOnChannel = function (channel) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.on(channel, function (data) {
                observer.next(data);
            });
            return function () { return _this.socket.disconnect(); };
        });
    };
    return WebSocketService;
}());
WebSocketService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], WebSocketService);
exports.WebSocketService = WebSocketService;
//# sourceMappingURL=websocket.service.js.map