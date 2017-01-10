import { Component, Input, OnInit } from '@angular/core';
import { WebSocketService } from '../websocket/websocket.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { Navio, TipoNavio, Orientacao } from './navio';
import { Tabuleiro } from './tabuleiro';
import { Celula, TipoCelula } from './celula';


@Component({
    moduleId: module.id,
    selector: 'board',
    templateUrl: 'board.component.html',
    styleUrls: ['board.component.css']
})
export class BoardComponent implements OnInit {
    public error: string = '';
    public elementos: Celula[] = [];
    public tipoNavio: TipoNavio;

    public tipoOrientacao: Orientacao;

    public linha: string;
    public coluna: string;

    public tipo: any;
    public orient: any;

    public tabuleiro: Tabuleiro;

    private countCouracados: number = 0;
    private countPortaAvioes: number = 0;
    private countCruzador: number = 0;
    private countContratorpedeiros: number = 0;
    private countSubmarino: number = 0;

    private room: string;

    public tabuleirosAtaque: Tabuleiro[] = [];
    public adversarios: string[] = [];
    public temAdversario: boolean = false;
    public imReady: boolean = false;
    chatChannel: string[] = [];
    public allReady: boolean = false;
    public isMyTurn: boolean = false;




    constructor(private websocketService: WebSocketService, private route: ActivatedRoute, private auth: AuthService) { }

    ngOnInit() {
        this.websocketService.getChatMessagesOnRoom().subscribe((m: any) => this.chatChannel.push(<string>m));

        this.route.params.subscribe(params => {
            this.room = params['room'];
        });

        this.tipo = 0;
        this.orient = 0;
        this.elementos = [];
        this.tipoNavio = 0;
        this.tipoOrientacao = 0;


        this.websocketService.getPlayersReady().subscribe((r: any) => {
            this.temAdversario = true;
            //  console.log("Ready: " + r.message); //r = username adversário
            this.adversarios.push(r.username);
            this.tabuleirosAtaque.push(new Tabuleiro());
        });

        this.websocketService.getTiro().subscribe((r: any) => {
            // console.log(r);
            //Object { usernameAlvo: "brunoanastacio", linha: "A", coluna: 1, tipo: 2 }
            if (this.auth.getCurrentUser().username == r.usernameAlvo) {
                this.tabuleiro.getCelula(r.linha, r.coluna).tipo = r.tipo;
            }

            this.adversarios.forEach((nomeAdv, index) => {
                if (nomeAdv == r.usernameAlvo) {
                    this.tabuleirosAtaque[index].getCelula(r.linha, r.coluna).tipo = r.tipo;
                }
            });
        });

        this.websocketService.getAfundou().subscribe((r: any) => {
            console.log(r);
            r.celulasAfundar.forEach((cell: Celula) => {
                if (this.auth.getCurrentUser().username == r.usernameAlvo) {
                    this.tabuleiro.getCelula(cell.posicao.linha, cell.posicao.coluna).tipo = TipoCelula.Afundado;
                }
                this.adversarios.forEach((nomeAdv, index) => {
                    if (nomeAdv == r.usernameAlvo) {
                        this.tabuleirosAtaque[index].getCelula(cell.posicao.linha, cell.posicao.coluna).tipo = TipoCelula.Afundado;
                    }
                });
            });
        });

        this.websocketService.getDerrotado().subscribe((r: any) => {
            if (this.auth.getCurrentUser().username == r.usernameAlvo) {
                console.log("Derrotado");
                    this.error = 'Fui derrotado';
                }
        });

        this.websocketService.getAllPlayersReady().subscribe((r: any) => {
            console.log(r);
            this.allReady = true;
        });

        this.websocketService.getTurn().subscribe((r: string) => {
            //r = username
            if (r === this.auth.getCurrentUser().username) {
                this.error = 'É a minha vez!';
                this.isMyTurn = true;
            } else {
                this.isMyTurn = false;
                this.error = 'É a vez do jogador: ' + r;
            }
        });

        this.websocketService.getTipoNavio().subscribe((m: any) => {

            let tipoNavioString: any;

            switch (m.tipoNavio) {
                case 0: tipoNavioString = "Porta-Avioes";
                    break;
                case 1: tipoNavioString = "Couracado";

                    break;
                case 2: tipoNavioString = "Cruzador";

                    break;
                case 3: tipoNavioString = "ContraTorpedeiro";

                    break;
                case 4: tipoNavioString = "Submarino";
                    break;
            }

            this.error = 'O jogador ' + m.myUsername + ' acertou no navio ' +
                tipoNavioString + ' do ' + m.usernameAlvo;
            this.websocketService.sendNote(this.error);

        });

        this.tabuleiro = new Tabuleiro();
        this.elementos = this.tabuleiro.celulas;
    }

    add() {
        try {
            let tipoNavio = TipoNavio.PortaAvioes;
            switch (this.tipo) {
                case "0": tipoNavio = TipoNavio.PortaAvioes;
                    if (this.countPortaAvioes >= 1) {
                        throw new Error('Atingiu o número limite de PortaAviões');
                    }
                    break;
                case "1": tipoNavio = TipoNavio.Couracado;
                    if (this.countCouracados >= 1) {
                        throw new Error('Atingiu o número limite de Couraçados');
                    }
                    break;
                case "2": tipoNavio = TipoNavio.Cruzador;
                    if (this.countCruzador >= 2) {
                        throw new Error('Atingiu o número limite de Cruzadores');
                    }
                    break;
                case "3": tipoNavio = TipoNavio.ContraTorpedeiro;
                    if (this.countContratorpedeiros >= 3) {
                        throw new Error('Atingiu o número limite de ContraTorpedeiros');
                    }
                    break;
                case "4": tipoNavio = TipoNavio.Submarino;
                    if (this.countSubmarino >= 4) {
                        throw new Error('Atingiu o número limite de Submarinos');
                    }
                    break;
            }

            let orientacao = Orientacao.Normal;
            switch (this.orient) {
                case "1": orientacao = Orientacao.Roda90;
                    break;
                case "2": orientacao = Orientacao.Roda180;
                    break;
                case "3": orientacao = Orientacao.Roda270;
                    break;
            }

            this.tabuleiro.adicionaNavio(tipoNavio, orientacao, this.linha, Number.parseInt(this.coluna));
            switch (tipoNavio) {
                case TipoNavio.PortaAvioes:
                    this.countPortaAvioes++;
                    break;
                case TipoNavio.Couracado:
                    this.countCouracados++;
                    break;
                case TipoNavio.Cruzador:
                    this.countCruzador++;
                    break;
                case TipoNavio.ContraTorpedeiro:
                    this.countContratorpedeiros++;
                    break;
                case TipoNavio.Submarino:
                    this.countSubmarino++;
                    break;
            }

            this.elementos = this.tabuleiro.celulas;
            this.error = '';
        } catch (e) {
            this.error = e;
            console.log(this.error);
        }
        // console.log("MEU TABULEIRO:");
        // console.log(this.tabuleiro.celulas);
    }


    clean() {
        this.tabuleiro = new Tabuleiro();
        this.elementos = this.tabuleiro.celulas;

        this.countCouracados = 0;
        this.countPortaAvioes = 0;
        this.countCruzador = 0;
        this.countContratorpedeiros = 0;
        this.countSubmarino = 0;
        this.error = '';
        this.imReady = false;
    }

    ready() {
         if(this.countPortaAvioes != 1 || this.countCouracados != 1 || this.countCruzador != 2 || this.countContratorpedeiros != 3 || this.countSubmarino != 4){
             this.error = 'Ainda tem barcos por colocar!';
             return;
         }
        console.log("I'm ready: " + this.auth.getCurrentUser().username);

        let auxNavios: any[] = [];

        this.tabuleiro.navios.forEach((navio: Navio) => {
            let tipo = navio.tipoNavio;
            let coluna = navio.posicao.coluna;
            let linha = navio.posicao.linha;
            let orient = navio.orientacao;

            auxNavios.push({ tipo: tipo, orient: orient, linha: linha, coluna: coluna });
        });
        this.imReady = true;
        this.websocketService.notifyAllPlayersImReady({ myBoats: auxNavios, username: this.auth.getCurrentUser().username });
    }


    disparar(cellAlvo: Celula, adversario: string) {
        if (!this.allReady) {
            this.error = 'Existem players que ainda não estão ready!';
            return;
        }

        if (!this.isMyTurn) {
            return;
        }

        this.websocketService.sendTiro({ celulaAlvo: cellAlvo, adversario: adversario, roomGame: this.room });
    }

    getColor(cell: Celula) {
        switch (cell.tipo) {
            case 0: return 'lightblue';
            case 1: return 'yellow';
            case 2: return 'red';
            case 3: return 'white';
            case 4: return 'black';
        }
        return 'white';
    }



}




