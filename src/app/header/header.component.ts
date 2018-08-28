import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { AppState } from '../state/app.state';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription;
  balance: string;
  account: string;
  role: string;

  constructor(private appState: AppState, private _ngZone: NgZone) {
    this.subscriptions = new Subscription();
    this.setupListeners();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setupListeners() {
    const balanceSub = this.appState.balance.subscribe(res =>
      this._ngZone.run(() => this.changeBalance(res))
    );
    const accountSub = this.appState.account.subscribe(res =>
      this._ngZone.run(() => this.changeAccount(res))
    );
    const roleSub = this.appState.role.subscribe(res => {
      console.log(res);
      const role = res.admin
        ? 'Admin'
        : res.merchant
          ? 'Storekeeper'
          : 'Shopper';
      console.log(role);
      this._ngZone.run(() => this.changeRole(role));
    });
    this.subscriptions.add(balanceSub);
    this.subscriptions.add(accountSub);
    this.subscriptions.add(roleSub);
  }

  changeAccount(account: string) {
    this.account = account;
  }

  changeRole(role: string) {
    this.role = role;
  }

  changeBalance(balance: string) {
    this.balance = balance;
  }
}
