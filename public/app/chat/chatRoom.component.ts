import { Component } from '@angular/core';
import { WebSocketService } from '../websocket/websocket.service';

import { AuthService } from '../services/auth.service';

@Component({
    moduleId: module.id,
    selector: 'chatroom',
    templateUrl: 'chat.component.html'
})
export class ChatRoomComponent {
    message: string;

    constructor(private websocketService: WebSocketService, private auth: AuthService) {}

    send(): void {
         if (this.message != '' && this.message != null) {
            this.websocketService.sendChatMessageOnRoom(this.auth.getCurrentUser().username + ": " + this.message);
            this.message = '';
        }
    }



}
