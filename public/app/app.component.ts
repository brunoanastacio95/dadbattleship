import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html'
})
export class AppComponent { 

     constructor(private auth: AuthService) { 
    }

  logout(): void {
         this.auth.logout().subscribe();
        // this.auth.logout().subscribe(res => console.log(res));
    }

}
