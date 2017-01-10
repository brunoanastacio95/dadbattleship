import { Component } from '@angular/core';
import { WebSocketService } from '../websocket/websocket.service';

import { AuthService } from '../services/auth.service';

@Component({
    moduleId: module.id,
    selector: 'chat-control',
    templateUrl: 'chat.component.html'
})
export class ChatComponent {
    message: string;

    constructor(private websocketService: WebSocketService, private auth: AuthService) { }


    send(): void {
        if (this.message != '' && this.message != null) {
            this.websocketService.sendChatMessage(this.auth.getCurrentUser().username + ": " + this.message);
            this.message = '';
        }
    }


}
