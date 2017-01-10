import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../websocket/websocket.service';
import { Router } from '@angular/router';

import { GameService } from '../services/game.service';
import { AuthService } from '../services/auth.service';

import { Game } from '../classes/game';

@Component({
    moduleId: module.id,
    selector: 'lobby',
    templateUrl: 'lobby.component.html'
})
export class LobbyComponent implements OnInit {
    message: string;
    error: boolean = false;
    gameCreated: boolean = false;
    myGames: Game[] = [];
    onHoldGames: Game[] = [];


    constructor(private websocketService: WebSocketService, private game: GameService, private auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.findOnHoldGames();
        this.findMyGames();

        this.websocketService.getNewRoom().subscribe((m: any) => {
            this.findOnHoldGames();
            this.findMyGames();
        });

        this.websocketService.getJoinOnRoom().subscribe((m: any) => {
            console.log("JOIN: " + m);
            this.findMyGames();
            this.findOnHoldGames();
        });

        this.websocketService.getGameStart().subscribe((m: any) => {
            console.log("JOGO COMEÇOU AAAAA : " + m);
            this.router.navigateByUrl('/board/' + m);
        });

        this.websocketService.getRoomDeleted().subscribe((m: any) => {
            console.log("quase que apaguei");
            this.findOnHoldGames();
            this.findMyGames();
        });

        


    }

    newGame(): void {
        // console.log("Creating new game, user: " + this.auth.getCurrentUser().username);
        this.game.newGame(this.auth.getCurrentUser()).subscribe((res: any) => {
            if (res !== 'No game data') {
                this.message = 'Game created with success!';
                this.gameCreated = true;
                //id do jogo criado = res._id
                // console.log("RES: " + res._id /* this.message*/);
                this.websocketService.newRoom({ room: 'room' + res._id, userId: this.auth.getCurrentUser()._id, username: this.auth.getCurrentUser().username });
                console.log("Websocket channel => " + "room");

                this.findMyGames();
            } else {
                this.error = true;
                this.gameCreated = false;
            }
            setTimeout(() => {
                this.message = '';
                this.gameCreated = false;
            }, 1000);
        });
    }

    joinGame(i: number): void {
        //  console.log("Jogo: " + this.onHoldGames[i]._id + "  value i: " + i);
        //   console.log("Nr players: " + this.onHoldGames[i].players.length);
        if (this.onHoldGames[i].players.length == 4) {
            this.error = true;
            console.log(this.message = 'Lobby full');
            return;
        }

        this.game.findOnHoldGames(this.auth.getCurrentUser()).subscribe(games => {
            if (games.length !== 0) {
                this.onHoldGames = games;
                this.onHoldGames[i].players.push({ player: this.auth.getCurrentUser()._id, score: 0 });

                this.game.updateGame(this.onHoldGames[i], this.auth.getCurrentUser()).subscribe(r => console.log(/*r*/));
                console.log('Entrou no jogo: ' + this.onHoldGames[i]._id);

                //enviar através de websocket que alguém entrou na partida
                this.websocketService.joinRoom({ userId: this.auth.getCurrentUser()._id, username: this.auth.getCurrentUser().username, room: 'room' + this.onHoldGames[i]._id });

                this.findOnHoldGames();
            } else {
                this.error = true;
                console.log(this.message = 'Não foi possivel entrar em jogo');
            }

        });

    }

    cancelGame(i: number): void {
        console.log("delete game: " + this.myGames[i]._id);
        /*  this.myGames[i].gameStatus = 'canceled';
          this.game.updateGame(this.myGames[i], this.auth.getCurrentUser()).subscribe(r => console.log(r));*/
        this.game.deleteGame(this.myGames[i], this.auth.getCurrentUser()).subscribe(r => console.log(r));
        this.websocketService.roomDeleted({ room: 'room' + this.myGames[i]._id});
        this.findMyGames();
    }

    findMyGames() {
        this.game.findGamesByUser(this.auth.currentUser).subscribe(r => {
            this.myGames = r;
        });
    }

    findOnHoldGames() {
        this.game.findOnHoldGames(this.auth.currentUser).subscribe(r => {
            this.onHoldGames = r;
        });
    }

    startGame(i: number) {
        console.log("Start game: " + this.myGames[i]._id);
        let room: string = 'room' + this.myGames[i]._id;
        //notificar todos os jogadores que o jogo começou
        this.myGames[i].gameStatus = 'playing';
        this.game.updateGame(this.myGames[i], this.auth.getCurrentUser()).subscribe(r => console.log(/*r*/));
        this.websocketService.notifyAllPlayerGameStarted({ message: 'Game Start!', room: room });
        //console.log("this is my data :  " + this.myGames[i]._id);
    }



}
