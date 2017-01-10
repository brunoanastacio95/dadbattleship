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
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var websocket_service_1 = require("./websocket/websocket.service");
var auth_service_1 = require("./services/auth.service");
var game_service_1 = require("./services/game.service");
var top10_service_1 = require("./services/top10.service");
var app_component_1 = require("./app.component");
var home_component_1 = require("./home/home.component");
var notifications_module_1 = require("./notifications/notifications.module");
var notificationsRoom_module_1 = require("./notifications/notificationsRoom.module");
var chat_component_1 = require("./chat/chat.component");
var chatRoom_component_1 = require("./chat/chatRoom.component");
var login_component_1 = require("./login/login.component");
var board_component_1 = require("./game/board.component");
var lobby_component_1 = require("./lobby/lobby.component");
var register_component_1 = require("./register/register.component");
var top10_component_1 = require("./home/top10.component");
var gameHistory_component_1 = require("./game/gameHistory.component");
var app_routing_module_1 = require("./app-routing.module");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, notifications_module_1.NotificationModule, forms_1.FormsModule, app_routing_module_1.AppRoutingModule, notificationsRoom_module_1.NotificationRoomModule],
        declarations: [app_component_1.AppComponent, home_component_1.HomeComponent, chat_component_1.ChatComponent, login_component_1.LoginComponent, register_component_1.RegisterComponent,
            board_component_1.BoardComponent, lobby_component_1.LobbyComponent, gameHistory_component_1.GameHistoryComponent, top10_component_1.Top10Component, chatRoom_component_1.ChatRoomComponent,],
        providers: [websocket_service_1.WebSocketService, auth_service_1.AuthService, game_service_1.GameService, top10_service_1.Top10Service],
        bootstrap: [app_component_1.AppComponent]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map