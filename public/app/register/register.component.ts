import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { User } from '../classes/user';

@Component({
    moduleId: module.id,
    selector: 'register-form',
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    registerMessage = '';
    auxUser = new User(0, '', '', -1, 0, '', '', '');

    registedWithSuccess: boolean = false;
    error: boolean = false;
    errorMessage = '';

    constructor(private authService: AuthService, private router: Router) { }

    register() {
        if(this.auxUser.password !== this.auxUser.passwordConfirmation){
            this.errorMessage = 'Password mismatch';
            this.error = true;
            return;
        }

        this.authService.register(this.auxUser.username, this.auxUser.password, this.auxUser.email).subscribe(res => {
            if (res['msg'] === 'username error') {
                this.errorMessage = 'Username already exists'
                this.error = true;
                this.registedWithSuccess = false;
            } else {
                this.registerMessage = 'Registed with success!';
                this.registedWithSuccess = true;
                this.error = false;
                console.log("username: " + this.auxUser.username + " password: " + this.auxUser.password);
                this.authService.login(this.auxUser.username, this.auxUser.password).subscribe(r => console.log(r));
                setTimeout(() => {
                    this.goBack(); 
                },1000);
            }
        });
    }

    goBack(): void {
        this.router.navigateByUrl('/home');
    }




}
