import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User } from '../classes/user';
import { Game } from '../classes/game';

@Injectable()
export class GameService {

    constructor(private http: Http) { }

    newGame(user: User): Observable<string> {
        let options = this.buildHeaders(user.token);
        return this.http.post('http://localhost:7777/api/v1/games', { ownerId: user._id, finish: false, players: [{ player: user._id, score: 0 }], gameStatus: 'on hold' }, options)
            .map(res => {
                return res.json();
            })
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            });
    }

    findOnHoldGames(user: User): Observable<Game[]> {
        let options = this.buildHeaders(user.token);
        let games: Game[] = [];
        let err: boolean = false;

        return this.http.get('http://localhost:7777/api/v1/games', options)
            .map(res => {
                res.json().forEach((game: Game) => {
                    err = false;
                    if (game.gameStatus === 'on hold' && game.ownerId !== user._id.toString()) {
                        game.players.forEach((player :any) => {
                         //   console.log("ids: " + player.player + "  |  " + user._id);
                            if (player.player === user._id) {
                                err = true;
                            }
                        });
                        if (!err) {
                             games.push(game);
                        }
                    }
                });
                return games;
            })
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            });
    }

    findGamesByUser(user: User): Observable<Game[]> {
        let options = this.buildHeaders(user.token);
        let games: Game[] = [];

        return this.http.get('http://localhost:7777/api/v1/games', options)
            .map(res => {
                res.json().forEach((game: Game) => {
                    if (game.ownerId === user._id.toString()) {
                        games.push(game);
                    }
                });
                return games;
            })
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            });
    }


    updateGame(game: Game, user: User): Observable<Game> {
        console.log(user.username + " está a tentar entrar no jogo: " + game._id);

        let options = this.buildHeaders(user.token);
        let url = 'http://localhost:7777/api/v1/games/' + game._id;
       // console.log("URL: " + url);
        return this.http.put(url, JSON.stringify(game), options)
            .map(res => {
                return res.json();
            })
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            });
    }

    deleteGame(game: Game, user: User){
        let options = this.buildHeaders(user.token);
        let url = 'http://localhost:7777/api/v1/games/' + game._id;
        return this.http.delete(url, options)
            .map(res => {
                return res.json();
            })
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            });
    }


    buildHeaders(token: string): RequestOptions {
        let headers = new Headers();
        headers.append('Authorization', 'bearer ' + token);
        headers.append('Content-Type', 'application/json');
        return new RequestOptions({ headers: headers });
    }



}