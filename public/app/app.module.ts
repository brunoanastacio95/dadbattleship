import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { WebSocketService } from './websocket/websocket.service';
import { AuthService } from './services/auth.service';
import { GameService } from './services/game.service';
import { Top10Service } from './services/top10.service';

import { AppComponent } from './app.component';
import { HomeComponent }   from './home/home.component';
import { NotificationModule } from './notifications/notifications.module';
import { NotificationRoomModule } from './notifications/notificationsRoom.module';
import { ChatComponent } from './chat/chat.component';
import { ChatRoomComponent } from './chat/chatRoom.component';
import { LoginComponent } from './login/login.component';
import { BoardComponent } from './game/board.component';
import { LobbyComponent } from './lobby/lobby.component';
import { RegisterComponent } from './register/register.component';

import { Top10Component } from './home/top10.component';
import { GameHistoryComponent } from './game/gameHistory.component';


import { AppRoutingModule }     from './app-routing.module';

@NgModule({
  imports: [BrowserModule, NotificationModule, FormsModule, AppRoutingModule,NotificationRoomModule],
  declarations: [AppComponent, HomeComponent, ChatComponent, LoginComponent, RegisterComponent, 
                BoardComponent, LobbyComponent, GameHistoryComponent ,Top10Component, ChatRoomComponent,],
  providers: [WebSocketService, AuthService, GameService, Top10Service],
  bootstrap: [AppComponent]
})

export class AppModule { }




