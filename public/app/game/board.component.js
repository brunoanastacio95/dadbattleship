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
var websocket_service_1 = require("../websocket/websocket.service");
var router_1 = require("@angular/router");
var auth_service_1 = require("../services/auth.service");
var navio_1 = require("./navio");
var tabuleiro_1 = require("./tabuleiro");
var celula_1 = require("./celula");
var BoardComponent = (function () {
    function BoardComponent(websocketService, route, auth) {
        this.websocketService = websocketService;
        this.route = route;
        this.auth = auth;
        this.error = '';
        this.elementos = [];
        this.countCouracados = 0;
        this.countPortaAvioes = 0;
        this.countCruzador = 0;
        this.countContratorpedeiros = 0;
        this.countSubmarino = 0;
        this.tabuleirosAtaque = [];
        this.adversarios = [];
        this.temAdversario = false;
        this.imReady = false;
        this.chatChannel = [];
        this.allReady = false;
        this.isMyTurn = false;
    }
    BoardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.websocketService.getChatMessagesOnRoom().subscribe(function (m) { return _this.chatChannel.push(m); });
        this.route.params.subscribe(function (params) {
            _this.room = params['room'];
        });
        this.tipo = 0;
        this.orient = 0;
        this.elementos = [];
        this.tipoNavio = 0;
        this.tipoOrientacao = 0;
        this.websocketService.getPlayersReady().subscribe(function (r) {
            _this.temAdversario = true;
            //  console.log("Ready: " + r.message); //r = username adversário
            _this.adversarios.push(r.username);
            _this.tabuleirosAtaque.push(new tabuleiro_1.Tabuleiro());
        });
        this.websocketService.getTiro().subscribe(function (r) {
            // console.log(r);
            //Object { usernameAlvo: "brunoanastacio", linha: "A", coluna: 1, tipo: 2 }
            if (_this.auth.getCurrentUser().username == r.usernameAlvo) {
                _this.tabuleiro.getCelula(r.linha, r.coluna).tipo = r.tipo;
            }
            _this.adversarios.forEach(function (nomeAdv, index) {
                if (nomeAdv == r.usernameAlvo) {
                    _this.tabuleirosAtaque[index].getCelula(r.linha, r.coluna).tipo = r.tipo;
                }
            });
        });
        this.websocketService.getAfundou().subscribe(function (r) {
            console.log(r);
            r.celulasAfundar.forEach(function (cell) {
                if (_this.auth.getCurrentUser().username == r.usernameAlvo) {
                    _this.tabuleiro.getCelula(cell.posicao.linha, cell.posicao.coluna).tipo = celula_1.TipoCelula.Afundado;
                }
                _this.adversarios.forEach(function (nomeAdv, index) {
                    if (nomeAdv == r.usernameAlvo) {
                        _this.tabuleirosAtaque[index].getCelula(cell.posicao.linha, cell.posicao.coluna).tipo = celula_1.TipoCelula.Afundado;
                    }
                });
            });
        });
        this.websocketService.getDerrotado().subscribe(function (r) {
            if (_this.auth.getCurrentUser().username == r.usernameAlvo) {
                console.log("Derrotado");
                _this.error = 'Fui derrotado';
            }
        });
        this.websocketService.getAllPlayersReady().subscribe(function (r) {
            console.log(r);
            _this.allReady = true;
        });
        this.websocketService.getTurn().subscribe(function (r) {
            //r = username
            if (r === _this.auth.getCurrentUser().username) {
                _this.error = 'É a minha vez!';
                _this.isMyTurn = true;
            }
            else {
                _this.isMyTurn = false;
                _this.error = 'É a vez do jogador: ' + r;
            }
        });
        this.websocketService.getTipoNavio().subscribe(function (m) {
            var tipoNavioString;
            switch (m.tipoNavio) {
                case 0:
                    tipoNavioString = "Porta-Avioes";
                    break;
                case 1:
                    tipoNavioString = "Couracado";
                    break;
                case 2:
                    tipoNavioString = "Cruzador";
                    break;
                case 3:
                    tipoNavioString = "ContraTorpedeiro";
                    break;
                case 4:
                    tipoNavioString = "Submarino";
                    break;
            }
            _this.error = 'O jogador ' + m.myUsername + ' acertou no navio ' +
                tipoNavioString + ' do ' + m.usernameAlvo;
            _this.websocketService.sendNote(_this.error);
        });
        this.tabuleiro = new tabuleiro_1.Tabuleiro();
        this.elementos = this.tabuleiro.celulas;
    };
    BoardComponent.prototype.add = function () {
        try {
            var tipoNavio = navio_1.TipoNavio.PortaAvioes;
            switch (this.tipo) {
                case "0":
                    tipoNavio = navio_1.TipoNavio.PortaAvioes;
                    if (this.countPortaAvioes >= 1) {
                        throw new Error('Atingiu o número limite de PortaAviões');
                    }
                    break;
                case "1":
                    tipoNavio = navio_1.TipoNavio.Couracado;
                    if (this.countCouracados >= 1) {
                        throw new Error('Atingiu o número limite de Couraçados');
                    }
                    break;
                case "2":
                    tipoNavio = navio_1.TipoNavio.Cruzador;
                    if (this.countCruzador >= 2) {
                        throw new Error('Atingiu o número limite de Cruzadores');
                    }
                    break;
                case "3":
                    tipoNavio = navio_1.TipoNavio.ContraTorpedeiro;
                    if (this.countContratorpedeiros >= 3) {
                        throw new Error('Atingiu o número limite de ContraTorpedeiros');
                    }
                    break;
                case "4":
                    tipoNavio = navio_1.TipoNavio.Submarino;
                    if (this.countSubmarino >= 4) {
                        throw new Error('Atingiu o número limite de Submarinos');
                    }
                    break;
            }
            var orientacao = navio_1.Orientacao.Normal;
            switch (this.orient) {
                case "1":
                    orientacao = navio_1.Orientacao.Roda90;
                    break;
                case "2":
                    orientacao = navio_1.Orientacao.Roda180;
                    break;
                case "3":
                    orientacao = navio_1.Orientacao.Roda270;
                    break;
            }
            this.tabuleiro.adicionaNavio(tipoNavio, orientacao, this.linha, Number.parseInt(this.coluna));
            switch (tipoNavio) {
                case navio_1.TipoNavio.PortaAvioes:
                    this.countPortaAvioes++;
                    break;
                case navio_1.TipoNavio.Couracado:
                    this.countCouracados++;
                    break;
                case navio_1.TipoNavio.Cruzador:
                    this.countCruzador++;
                    break;
                case navio_1.TipoNavio.ContraTorpedeiro:
                    this.countContratorpedeiros++;
                    break;
                case navio_1.TipoNavio.Submarino:
                    this.countSubmarino++;
                    break;
            }
            this.elementos = this.tabuleiro.celulas;
            this.error = '';
        }
        catch (e) {
            this.error = e;
            console.log(this.error);
        }
        // console.log("MEU TABULEIRO:");
        // console.log(this.tabuleiro.celulas);
    };
    BoardComponent.prototype.clean = function () {
        this.tabuleiro = new tabuleiro_1.Tabuleiro();
        this.elementos = this.tabuleiro.celulas;
        this.countCouracados = 0;
        this.countPortaAvioes = 0;
        this.countCruzador = 0;
        this.countContratorpedeiros = 0;
        this.countSubmarino = 0;
        this.error = '';
        this.imReady = false;
    };
    BoardComponent.prototype.ready = function () {
        if (this.countPortaAvioes != 1 || this.countCouracados != 1 || this.countCruzador != 2 || this.countContratorpedeiros != 3 || this.countSubmarino != 4) {
            this.error = 'Ainda tem barcos por colocar!';
            return;
        }
        console.log("I'm ready: " + this.auth.getCurrentUser().username);
        var auxNavios = [];
        this.tabuleiro.navios.forEach(function (navio) {
            var tipo = navio.tipoNavio;
            var coluna = navio.posicao.coluna;
            var linha = navio.posicao.linha;
            var orient = navio.orientacao;
            auxNavios.push({ tipo: tipo, orient: orient, linha: linha, coluna: coluna });
        });
        this.imReady = true;
        this.websocketService.notifyAllPlayersImReady({ myBoats: auxNavios, username: this.auth.getCurrentUser().username });
    };
    BoardComponent.prototype.disparar = function (cellAlvo, adversario) {
        if (!this.allReady) {
            this.error = 'Existem players que ainda não estão ready!';
            return;
        }
        if (!this.isMyTurn) {
            return;
        }
        this.websocketService.sendTiro({ celulaAlvo: cellAlvo, adversario: adversario, roomGame: this.room });
    };
    BoardComponent.prototype.getColor = function (cell) {
        switch (cell.tipo) {
            case 0: return 'lightblue';
            case 1: return 'yellow';
            case 2: return 'red';
            case 3: return 'white';
            case 4: return 'black';
        }
        return 'white';
    };
    return BoardComponent;
}());
BoardComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'board',
        templateUrl: 'board.component.html',
        styleUrls: ['board.component.css']
    }),
    __metadata("design:paramtypes", [websocket_service_1.WebSocketService, router_1.ActivatedRoute, auth_service_1.AuthService])
], BoardComponent);
exports.BoardComponent = BoardComponent;
//# sourceMappingURL=board.component.js.map