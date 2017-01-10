import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { User } from '../classes/user';

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: 'login.component.html'
})

export class LoginComponent {
    error: boolean = false;
    loggedIn: boolean = false;
    loginMessage = '';
    auxUser = new User(0, '', '', -1, 0, '', '', '');

    constructor(private authService: AuthService, private router: Router) { }

    login(): void {
        this.authService.login(this.auxUser.username, this.auxUser.password).subscribe(res => {
            if (res) {
                this.loggedIn = true;
                this.error = false;
                this.loginMessage = "Success on login";
                setTimeout(() => {
                    this.goBack();
                }, 1000);

            } else {
                this.error = true;
            }
        });
    }

    goBack(): void {
        this.router.navigateByUrl('/home');
    }

}



