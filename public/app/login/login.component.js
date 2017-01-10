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
var LoginComponent = (function () {
    function LoginComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.error = false;
        this.loggedIn = false;
        this.loginMessage = '';
        this.auxUser = new user_1.User(0, '', '', -1, 0, '', '', '');
    }
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.authService.login(this.auxUser.username, this.auxUser.password).subscribe(function (res) {
            if (res) {
                _this.loggedIn = true;
                _this.error = false;
                _this.loginMessage = "Success on login";
                setTimeout(function () {
                    _this.goBack();
                }, 1000);
            }
            else {
                _this.error = true;
            }
        });
    };
    LoginComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/home');
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'login',
        templateUrl: 'login.component.html'
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService, router_1.Router])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map