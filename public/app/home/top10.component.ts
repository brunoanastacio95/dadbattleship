import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../websocket/websocket.service';

import { AuthService } from '../services/auth.service';
import { Top10Service } from '../services/top10.service';
import { User } from '../classes/user';

@Component({
    moduleId: module.id,
    selector: 'top10-control',
    templateUrl: 'top10.component.html'
})
export class Top10Component implements OnInit {
    message: string;
    players: User[] = [];
    playersByScore: User[] = [];

    constructor(private top10Service: Top10Service) {


    }
    
    ngOnInit() {
        this.getPlayersTopPlayers();
        this.getPlayersTopPlayersByScore();
    }

    getPlayersTopPlayers(): void {
        this.top10Service.getTop10().subscribe(r => this.players = r);
    }

    getPlayersTopPlayersByScore(): void {
        this.top10Service.getTop10ByScore().subscribe(r => this.playersByScore = r);
    }

}