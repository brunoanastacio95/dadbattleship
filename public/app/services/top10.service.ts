import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User } from '../classes/user';

@Injectable()
export class Top10Service {
    constructor(private http: Http) { }
    players : User [] = [];

    getTop10(): Observable<User[]> {
        return this.http.get('http://localhost:7777/api/v1/top10')
            .map(res => {
                this.players = res.json();
                return this.players;


            })
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            });
    }

 getTop10ByScore(): Observable<User[]> {
        return this.http.get('http://localhost:7777/api/v1/top10ByScore')
            .map(res => {
                this.players = res.json();
                return this.players;

            })
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            });
    }
}