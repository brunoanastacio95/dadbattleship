import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }   from './login/login.component';
import { HomeComponent }   from './home/home.component';
import { RegisterComponent }   from './register/register.component';
import { GameHistoryComponent }   from './game/gameHistory.component';

import { BoardComponent }   from './game/board.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',  component: HomeComponent },
  { path: 'login',  component: LoginComponent },
  { path: 'register', component: RegisterComponent },
	{ path: 'gameHistory', component : GameHistoryComponent},
  { path: 'board/:room', component : BoardComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/


 
 