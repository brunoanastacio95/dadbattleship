import { Component, OnInit } from '@angular/core';

import {WebSocketService } from '../websocket/websocket.service';

@Component({
    moduleId: module.id,
    selector: 'notification-panel',
    templateUrl: 'notification.component.html'
})
export class NotificationComponent implements OnInit {
    playersChannel: string[] = [];
    chatChannel: string[] = [];
    gamesChannel: string[] = [];

    constructor(private websocketService: WebSocketService){
    }

    ngOnInit() {
        this.websocketService.getChatMessages().subscribe((m:any) => this.chatChannel.push(<string>m));
        this.websocketService.getPlayersMessages().subscribe((m:any) => this.playersChannel.push(<string>m));
        this.websocketService.getNewRoom().subscribe((m: any) => this.gamesChannel.push(<string>m));
    }

}
