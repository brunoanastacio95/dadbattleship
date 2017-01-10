"use strict";
var io = require('socket.io');
var celula_1 = require("./celula");
var tabuleiro_1 = require("./tabuleiro");
var app_games_1 = require("./app.games");
var WebSocketServer = (function () {
    function WebSocketServer() {
        var _this = this;
        this.games = [];
        this.init = function (server) {
            _this.user = null;
            _this.io = io.listen(server);
            _this.io.sockets.on('connection', function (client) {
                client.player = new Player();
                // client.player.game = new Game();
                client.on('login', function (data) { _this.user = data; console.log(_this.user); });
                client.emit('players', Date.now() + ': Welcome to battleship');
                client.broadcast.emit('players', Date.now() + ': A new player has arrived');
                client.on('chat', function (data) { return _this.io.emit('chat', data); });
                client.on('room', function (data) {
                    _this.io.emit('room', Date.now() + ': New game created: ' + data);
                    client.join(data.room);
                    client.player.username = data.username;
                    client.player.myId = data.userId;
                    client.player.gameRoom = data.room;
                    client.player.socketId = client.id;
                    _this.games[data.room] = new app_games_1.Game();
                    _this.games[data.room].gameRoom = data.room;
                    _this.games[data.room].usernameJogadoresOrdem.push(data.username);
                    console.log(_this.games[data.room]);
                });
                client.on('roomDeleted', function (data) {
                    _this.io.emit('roomDeleted', 'Game canceled');
                });
                //data = room+_id
                client.on('join', function (data) {
                    _this.io.emit('join', Date.now() + ': New player join ' + data.username);
                    // console.log(data);
                    client.player.gameRoom = data.room;
                    client.player.socketId = client.id;
                    client.player.username = data.username;
                    client.join(client.player.gameRoom); //room4484546858456
                    _this.games[data.room].usernameJogadoresOrdem.push(data.username);
                });
                client.on('game_start', function (data) {
                    _this.games[data.room].nJogadores = _this.games[data.room].usernameJogadoresOrdem.length;
                    _this.games[data.room].numeroTirosRonda = 2 * (_this.games[data.room].nJogadores - 1);
                    //console.log(this.games[data.room]);
                    _this.io.to(client.player.gameRoom).emit('game_start', client.player.gameRoom);
                    //  clien(client.player.gameRoom).emit('board', this.board);
                    //  console.log("EMITE para : " + client.player.gameRoom + "  mensagem: " + client.player.gameRoom );
                });
                client.on('roomChat', function (data) {
                    _this.io.to(client.player.gameRoom).emit('roomChat', data);
                });
                client.on('notes', function (data) {
                    console.log(data);
                    _this.io.to(client.player.gameRoom).emit('notes', data);
                });
                client.on('ready', function (data) {
                    data.myBoats.forEach(function (boat) {
                        client.player.myTabuleiro.adicionaNavio(boat.tipo, boat.orient, boat.linha, boat.coluna);
                    });
                    client.broadcast.to(client.player.gameRoom).emit('ready', { message: 'One player is ready!' + data.username, username: data.username });
                    _this.games[client.player.gameRoom].playersReady++;
                    if (_this.games[client.player.gameRoom].playersReady == _this.games[client.player.gameRoom].nJogadores) {
                        _this.io.to(client.player.gameRoom).emit('all_ready', 'Todos os jogadores estão prontos a jogar!');
                    }
                    // console.log("N barcos: " + client.player.myTabuleiro.navios.length);
                    var userTurn;
                    userTurn = _this.games[client.player.gameRoom].usernameJogadoresOrdem[_this.games[client.player.gameRoom].turnIndex];
                    _this.io.to(client.player.gameRoom).emit('yourTurn', userTurn);
                });
                client.on('tiro', function (data) {
                    var cellAlvo = data.celulaAlvo;
                    var usernameAdversario = data.adversario;
                    var gameRoom = data.roomGame;
                    //percorrer todos os tabuleiro e notificar os alvos
                    var players = [];
                    var socketsId = [];
                    for (var socket in _this.io.sockets.sockets) {
                        socketsId.push(socket);
                    }
                    socketsId.forEach(function (id) {
                        var p = new Player();
                        p.username = _this.io.sockets.sockets[id].player.username;
                        p.myId = _this.io.sockets.sockets[id].player.myId;
                        p.socketId = _this.io.sockets.sockets[id].player.socketId;
                        p.myTabuleiro = _this.io.sockets.sockets[id].player.myTabuleiro;
                        p.gameRoom = _this.io.sockets.sockets[id].player.gameRoom;
                        players.push(p);
                    });
                    players.forEach(function (player) {
                        if (player.username == data.adversario) {
                            var celulaOponente_1 = player.myTabuleiro.getCelula(cellAlvo.posicao.linha, cellAlvo.posicao.coluna);
                            if (celulaOponente_1.tiro == true)
                                return;
                            if (celulaOponente_1.tipo === celula_1.TipoCelula.Vazio) {
                                celulaOponente_1.tipo = celula_1.TipoCelula.Mar;
                                celulaOponente_1.tiro = true;
                            }
                            else if (celulaOponente_1.tipo === celula_1.TipoCelula.Navio) {
                                celulaOponente_1.tipo = celula_1.TipoCelula.Fogo;
                                celulaOponente_1.tiro = true;
                                player.myTabuleiro.navios.forEach(function (navio) {
                                    navio.celulas.forEach(function (cellNavio) {
                                        if (cellNavio.posicao === celulaOponente_1.posicao) {
                                            //  console.log(navio.tipoNavio);
                                            _this.io.to(player.gameRoom).emit('tipoNavio', {
                                                usernameAlvo: player.username, tipoNavio: navio.tipoNavio,
                                                myUsername: _this.io.sockets.sockets[client.id].player.username
                                            });
                                        }
                                    });
                                });
                            }
                            _this.io.to(player.gameRoom).emit('tiro', {
                                usernameAlvo: player.username, linha: celulaOponente_1.posicao.linha,
                                coluna: celulaOponente_1.posicao.coluna, tipo: celulaOponente_1.tipo
                            });
                            var i_1 = 0;
                            player.myTabuleiro.navios.forEach(function (navio) {
                                if (navio.afundou()) {
                                    i_1++;
                                    _this.io.to(player.gameRoom).emit('afundou', {
                                        celulasAfundar: navio.celulas,
                                        usernameAlvo: player.username
                                    });
                                }
                                if (i_1 === player.myTabuleiro.navios.length) {
                                    console.log("Derrotado");
                                    _this.io.to(player.gameRoom).emit('derrotado', {
                                        usernameAlvo: player.username
                                    });
                                }
                            });
                            _this.games[client.player.gameRoom].countTiro++;
                            cellAlvo.tiro = true;
                        }
                    });
                    if (_this.games[client.player.gameRoom].countTiro === _this.games[client.player.gameRoom].numeroTirosRonda) {
                        if (_this.games[client.player.gameRoom].turnIndex === _this.games[client.player.gameRoom].nJogadores - 1) {
                            _this.games[client.player.gameRoom].turnIndex = 0;
                        }
                        else {
                            _this.games[client.player.gameRoom].turnIndex++;
                        }
                        _this.games[client.player.gameRoom].countTiro = 0;
                        var userTurn = void 0;
                        userTurn = _this.games[client.player.gameRoom].usernameJogadoresOrdem[_this.games[client.player.gameRoom].turnIndex];
                        _this.io.to(client.player.gameRoom).emit('yourTurn', userTurn);
                        return;
                    }
                });
            });
        };
        //public notifyAll = (channel: string, message: string)
        this.notifyAll = function (channel, message) {
            _this.io.sockets.emit(channel, message);
        };
    }
    return WebSocketServer;
}());
exports.WebSocketServer = WebSocketServer;
;
var Player = (function () {
    function Player() {
        this.username = '';
        this.myId = 0;
        this.socketId = '';
        this.myTabuleiro = new tabuleiro_1.Tabuleiro();
        this.gameRoom = '';
    }
    return Player;
}());
exports.Player = Player;
/*export class Game {
    public gameRoom: string;
    public numeroTirosRonda: number = 0;
    public usernameJogadoresOrdem: string[] = [];
    public ordem: number[] = [];
    public countTiro: number = 0;
    public nJogadores: number = 0;
    public playersReady: number = 0;
    public turnIndex: number = 0;

    constructor() {
        this.gameRoom = '';
        this.numeroTirosRonda = 0;
        this.usernameJogadoresOrdem = [];
        this.ordem = [];
        this.countTiro = 0;
        this.nJogadores = 0;
        this.playersReady = 0;
        this.turnIndex = 0;
    }

}*/
