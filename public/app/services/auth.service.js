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
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
    }
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        return this.http.post('http://localhost:7777/api/v1/login', { username: username, password: password })
            .map(function (res) {
            _this.currentUser = res.json();
            return _this.currentUser;
        })
            .catch(function (e) {
            console.log(e);
            return Rx_1.Observable.of(null);
        });
    };
    AuthService.prototype.logout = function () {
        var _this = this;
        var options = this.buildHeaders();
        return this.http.post('http://localhost:7777/api/v1/logout', null, options)
            .map(function (res) {
            res.json();
            _this.currentUser = null;
            return _this.currentUser;
        })
            .catch(function (e) {
            console.log(e);
            return Rx_1.Observable.throw(e);
        });
    };
    AuthService.prototype.register = function (username, password, email) {
        return this.http.post('http://localhost:7777/api/v1/register', { username: username, password: password, email: email })
            .map(function (res) {
            return res.json();
        })
            .catch(function (e) {
            console.log(e);
            return Rx_1.Observable.throw(e);
        });
    };
    AuthService.prototype.isLogged = function () {
        return this.currentUser != null ? true : false;
    };
    AuthService.prototype.getCurrentUser = function () {
        return this.currentUser;
    };
    AuthService.prototype.buildHeaders = function () {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'bearer ' + this.currentUser.token);
        headers.append('Content-Type', 'application/json');
        return new http_1.RequestOptions({ headers: headers });
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map