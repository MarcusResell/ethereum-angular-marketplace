import { Component, NgZone, OnInit } from '@angular/core';
// import { Web3Service } from './services/web3.service';
// import { ContractService } from './services/contract.service';
// import { AppState } from './state/app.state';
// import { Subscriber } from 'rxjs';
// import { Router } from '@angular/router';
// declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  // TODO add proper types these variables
  account: any;
  accounts: any;

  balance = 'unknown';
  itemCount: string;
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  items = [];

  constructor() // private _ngZone: NgZone,
  // private web3Service: Web3Service,
  // private contractService: ContractService,
  // private appState: AppState,
  // private router: Router
  {}

  ngOnInit() {
    // this.appState.account.subscribe(res => console.log(res));
    // this.appState.accounts.subscribe(res => console.log(res));
    // this.appState.role.subscribe(res => console.log(res));
    // this.appState.balance.subscribe(res => console.log(res));
  }
}
