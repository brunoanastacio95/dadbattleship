import { Component, OnInit } from '@angular/core';

import {WebSocketService } from '../websocket/websocket.service';

@Component({
    moduleId: module.id,
    selector: 'notificationsRoom',
    templateUrl: 'notificationRoom.component.html'
})
export class NotificationRoomComponent implements OnInit {
    notes: string[] = [];
    

    constructor(private websocketService: WebSocketService){
    }

    ngOnInit() {
        this.websocketService.getNotes().subscribe((m:any) => this.notes.push(<string>m));
      
    }

}
