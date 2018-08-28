import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { Web3Service } from '../services/web3.service';
import { ContractService } from '../services/contract.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppState {
  private _account: BehaviorSubject<string> = new BehaviorSubject('0x0');
  public readonly account: Observable<string> = this._account.asObservable();

  private _accounts: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly accounts: Observable<any> = this._accounts.asObservable();

  private _balance: BehaviorSubject<string> = new BehaviorSubject('Unknown');
  public readonly balance: Observable<string> = this._balance.asObservable();

  private _role: BehaviorSubject<any> = new BehaviorSubject({
    admin: false,
    storekeeper: false
  });
  public readonly role: Observable<any> = this._role.asObservable();

  constructor(
    private web3Service: Web3Service,
    private contractService: ContractService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loadInitialData();
  }

  loadInitialData() {
    this.getAccounts(this.getUserRole.bind(this));
    this.getAccountChanges();
    this.getAccountBalance();
  }

  /* Account information */
  getAccounts(callback?: Function) {
    this.web3Service.getAccounts().subscribe(
      accs => {
        this._accounts.next(accs);
        this._account.next(accs[0]);

        if (callback) {
          callback(true);
        }
      },
      err => alert(err)
    );
  }

  getAccountChanges(): void {
    this.web3Service.getAccountChanges().subscribe((newAccount: string) => {
      if (newAccount !== this._account.getValue()) {
        console.log('NEW ACCOUNT EVENT', newAccount);
        this._account.next(newAccount);
        this.getAccountBalance();
        this.getUserRole();
      }
    });
  }

  getAccountBalance(): void {
    this.web3Service
      .getAccountInfo()
      .then((res: any) => {
        this._balance.next(res.balance.toString());
      })
      .catch(err => {
        console.log(err);
      });
  }

  getUserRole(redirect?: boolean) {
    const userAddress = this._account.getValue();
    return forkJoin(
      this.contractService.isAdministrator(userAddress),
      this.contractService.isStorekeeper(userAddress)
    ).subscribe(
      data => {
        const role = { admin: data[0], merchant: data[1] };
        const currentRole = this._role.getValue();
        if (
          currentRole.admin !== role.admin ||
          currentRole.storekeeper !== role.merchant ||
          redirect
        ) {
          const redirectUrl = role.admin
            ? '/admin'
            : role.merchant
              ? '/merchant'
              : '/dashboard';
          this.router.navigate([redirectUrl]);
        }
        this._role.next(role);
      },
      err => {
        console.log(err);
      }
    );
  }
}
