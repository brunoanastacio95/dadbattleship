import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { NotificationRoomComponent }  from './notificationRoom.component';

@NgModule({
  imports:      [ BrowserModule, HttpModule ],
  declarations: [ NotificationRoomComponent ],
  exports:      [ NotificationRoomComponent]
})
export class NotificationRoomModule { }
