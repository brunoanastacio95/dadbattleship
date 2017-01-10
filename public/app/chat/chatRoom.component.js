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
var auth_service_1 = require("../services/auth.service");
var ChatRoomComponent = (function () {
    function ChatRoomComponent(websocketService, auth) {
        this.websocketService = websocketService;
        this.auth = auth;
    }
    ChatRoomComponent.prototype.send = function () {
        if (this.message != '' && this.message != null) {
            this.websocketService.sendChatMessageOnRoom(this.auth.getCurrentUser().username + ": " + this.message);
            this.message = '';
        }
    };
    return ChatRoomComponent;
}());
ChatRoomComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'chatroom',
        templateUrl: 'chat.component.html'
    }),
    __metadata("design:paramtypes", [websocket_service_1.WebSocketService, auth_service_1.AuthService])
], ChatRoomComponent);
exports.ChatRoomComponent = ChatRoomComponent;
//# sourceMappingURL=chatRoom.component.js.map