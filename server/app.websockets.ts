const io = require('socket.io');

import { Celula, TipoCelula } from './celula';
import { Tabuleiro } from './tabuleiro';
import { Posicao } from './posicao';
import { Navio } from './navio';

import { Game } from './app.games';

export class WebSocketServer {
    public io: any;
    public user;
    public games: Game[] = [];

    public init = (server: any) => {
        this.user = null;

        this.io = io.listen(server);

        this.io.sockets.on('connection', (client: any) => {

            client.player = new Player();
            // client.player.game = new Game();

            client.on('login', (data) => { this.user = data; console.log(this.user); });
            client.emit('players', Date.now() + ': Welcome to battleship');
            client.broadcast.emit('players', Date.now() + ': A new player has arrived');
            client.on('chat', (data) => this.io.emit('chat', data));

            client.on('room', (data) => {

                this.io.emit('room', Date.now() + ': New game created: ' + data);
                client.join(data.room);

                client.player.username = data.username;
                client.player.myId = data.userId;
                client.player.gameRoom = data.room;
                client.player.socketId = client.id;

                this.games[data.room] = new Game();
                this.games[data.room].gameRoom = data.room;

                this.games[data.room].usernameJogadoresOrdem.push(data.username);
                console.log(this.games[data.room]);
            });


            client.on('roomDeleted', (data) => {

                this.io.emit('roomDeleted', 'Game canceled');
            });

            //data = room+_id
            client.on('join', (data) => {
                this.io.emit('join', Date.now() + ': New player join ' + data.username);
                // console.log(data);
                client.player.gameRoom = data.room;
                client.player.socketId = client.id;
                client.player.username = data.username;
                client.join(client.player.gameRoom); //room4484546858456

                this.games[data.room].usernameJogadoresOrdem.push(data.username);


            });

            client.on('game_start', (data) => {

                this.games[data.room].nJogadores = this.games[data.room].usernameJogadoresOrdem.length;
                this.games[data.room].numeroTirosRonda = 2 * (this.games[data.room].nJogadores - 1);
                //console.log(this.games[data.room]);
                this.io.to(client.player.gameRoom).emit('game_start', client.player.gameRoom);
                //  clien(client.player.gameRoom).emit('board', this.board);
                //  console.log("EMITE para : " + client.player.gameRoom + "  mensagem: " + client.player.gameRoom );
            });


            client.on('roomChat', (data) => {
                this.io.to(client.player.gameRoom).emit('roomChat', data);
            });

            client.on('notes', (data) => {
                console.log(data);
                this.io.to(client.player.gameRoom).emit('notes', data);
            });


            client.on('ready', (data) => {
                data.myBoats.forEach(boat => {
                    client.player.myTabuleiro.adicionaNavio(boat.tipo, boat.orient, boat.linha, boat.coluna);
                });

                client.broadcast.to(client.player.gameRoom).emit('ready', { message: 'One player is ready!' + data.username, username: data.username });

                this.games[client.player.gameRoom].playersReady++;
                if (this.games[client.player.gameRoom].playersReady == this.games[client.player.gameRoom].nJogadores) {

                    this.io.to(client.player.gameRoom).emit('all_ready', 'Todos os jogadores estão prontos a jogar!');
                }
                // console.log("N barcos: " + client.player.myTabuleiro.navios.length);
                let userTurn: string;
                userTurn = this.games[client.player.gameRoom].usernameJogadoresOrdem[this.games[client.player.gameRoom].turnIndex];

                this.io.to(client.player.gameRoom).emit('yourTurn', userTurn);
            });

            client.on('tiro', (data) => {
                let cellAlvo: Celula = data.celulaAlvo;
                let usernameAdversario: string = data.adversario;
                let gameRoom: number = data.roomGame;
                //percorrer todos os tabuleiro e notificar os alvos


                let players: Player[] = [];
                let socketsId: string[] = [];

                for (let socket in this.io.sockets.sockets) {
                    socketsId.push(socket);
                }

                socketsId.forEach(id => {
                    let p: Player = new Player();
                    p.username = this.io.sockets.sockets[id].player.username;
                    p.myId = this.io.sockets.sockets[id].player.myId;
                    p.socketId = this.io.sockets.sockets[id].player.socketId;
                    p.myTabuleiro = this.io.sockets.sockets[id].player.myTabuleiro;
                    p.gameRoom = this.io.sockets.sockets[id].player.gameRoom;
                    players.push(p);
                });

                players.forEach((player: Player) => {

                    if (player.username == data.adversario) {
                        let celulaOponente: Celula = player.myTabuleiro.getCelula(cellAlvo.posicao.linha, cellAlvo.posicao.coluna);

                        if (celulaOponente.tiro == true)
                            return;
                        if (celulaOponente.tipo === TipoCelula.Vazio) {
                            celulaOponente.tipo = TipoCelula.Mar;
                            celulaOponente.tiro = true;
                        } else if (celulaOponente.tipo === TipoCelula.Navio) {
                            celulaOponente.tipo = TipoCelula.Fogo;
                            celulaOponente.tiro = true;

                            player.myTabuleiro.navios.forEach(navio => {
                            
                                navio.celulas.forEach(cellNavio => {  
                                    if (cellNavio.posicao === celulaOponente.posicao) {
                                        //  console.log(navio.tipoNavio);
                                        this.io.to(player.gameRoom).emit('tipoNavio', {
                                            usernameAlvo: player.username, tipoNavio: navio.tipoNavio,
                                            myUsername: this.io.sockets.sockets[client.id].player.username
                                        });
                                    }
                                });
                            });

                        }
                        this.io.to(player.gameRoom).emit('tiro', {
                            usernameAlvo: player.username, linha: celulaOponente.posicao.linha,
                            coluna: celulaOponente.posicao.coluna, tipo: celulaOponente.tipo
                        });

                        let i : number = 0;
                         player.myTabuleiro.navios.forEach(navio => {
                                if (navio.afundou()) {
                                    i++;
                                        this.io.to(player.gameRoom).emit('afundou', {
                                            celulasAfundar: navio.celulas,
                                            usernameAlvo: player.username
                                        });
                                    }
                                    if(i === player.myTabuleiro.navios.length){
                                        console.log("Derrotado");
                                        this.io.to(player.gameRoom).emit('derrotado', {
                                            usernameAlvo: player.username
                                        });
                                    }
                         });

                        this.games[client.player.gameRoom].countTiro++;
                        cellAlvo.tiro = true;

                    }
                });

                if (this.games[client.player.gameRoom].countTiro === this.games[client.player.gameRoom].numeroTirosRonda) {
                    if (this.games[client.player.gameRoom].turnIndex === this.games[client.player.gameRoom].nJogadores - 1) {
                        this.games[client.player.gameRoom].turnIndex = 0;
                    } else {
                        this.games[client.player.gameRoom].turnIndex++;
                    }
                    this.games[client.player.gameRoom].countTiro = 0;
                    let userTurn: string;
                    userTurn = this.games[client.player.gameRoom].usernameJogadoresOrdem[this.games[client.player.gameRoom].turnIndex];

                    this.io.to(client.player.gameRoom).emit('yourTurn', userTurn);
                    return;
                }
            });


        });
    };

    //public notifyAll = (channel: string, message: string)
    public notifyAll = (channel: string, message: any) => {
        this.io.sockets.emit(channel, message);
    };

};


export class Player {
    public username: string;
    public myId: number;
    public gameRoom: string;
    public socketId: string;
    public myTabuleiro: Tabuleiro;


    constructor() {
        this.username = '';
        this.myId = 0;
        this.socketId = '';
        this.myTabuleiro = new Tabuleiro();
        this.gameRoom = '';
    }
}

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



