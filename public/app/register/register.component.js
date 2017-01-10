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
var router_1 = require("@angular/router");
var auth_service_1 = require("../services/auth.service");
var user_1 = require("../classes/user");
var RegisterComponent = (function () {
    function RegisterComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.registerMessage = '';
        this.auxUser = new user_1.User(0, '', '', -1, 0, '', '', '');
        this.registedWithSuccess = false;
        this.error = false;
        this.errorMessage = '';
    }
    RegisterComponent.prototype.register = function () {
        var _this = this;
        if (this.auxUser.password !== this.auxUser.passwordConfirmation) {
            this.errorMessage = 'Password mismatch';
            this.error = true;
            return;
        }
        this.authService.register(this.auxUser.username, this.auxUser.password, this.auxUser.email).subscribe(function (res) {
            if (res['msg'] === 'username error') {
                _this.errorMessage = 'Username already exists';
                _this.error = true;
                _this.registedWithSuccess = false;
            }
            else {
                _this.registerMessage = 'Registed with success!';
                _this.registedWithSuccess = true;
                _this.error = false;
                console.log("username: " + _this.auxUser.username + " password: " + _this.auxUser.password);
                _this.authService.login(_this.auxUser.username, _this.auxUser.password).subscribe(function (r) { return console.log(r); });
                setTimeout(function () {
                    _this.goBack();
                }, 1000);
            }
        });
    };
    RegisterComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/home');
    };
    return RegisterComponent;
}());
RegisterComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'register-form',
        templateUrl: 'register.component.html'
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService, router_1.Router])
], RegisterComponent);
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map