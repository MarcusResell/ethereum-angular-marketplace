import { Component, OnInit, NgZone } from '@angular/core';
import { Web3Service } from '../services/web3.service';
import { ContractService } from '../services/contract.service';
import { AppState } from '../state/app.state';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  newAddress = { address: '', valid: false };
  success = false;
  waitingForApproval = false;
  admin: boolean;
  merchants = [];

  constructor(
    private web3Service: Web3Service,
    private contractService: ContractService,
    private appState: AppState,
    private _ngZone: NgZone
  ) {
    this.appState.role.subscribe(res => {
      this._ngZone.run(() => (this.admin = res.admin));
      this.getMerchantCount();
    });
  }

  ngOnInit() {}

  addMerchant() {
    const address: string = this.newAddress.address;
    if (this.web3Service.web3.isAddress(address)) {
      this.waitingForApproval = true;
      this.contractService.addMerchant(address).subscribe(
        res => {
          this.waitingForApproval = false;
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 5000);
          this.newAddress.address = '';
          this.newAddress.valid = true;
        },
        err => console.log(err)
      );
    } else {
      this.newAddress.valid = false;
    }
  }

  getMerchantCount() {
    this.contractService.getMerchantCount().subscribe((res: number) => {
      console.log(res);
      if (res > 0) {
        this._ngZone.run(() => this.getMerchants(res));
      }
    });
  }

  getMerchants(count: number) {
    this.contractService.getMerchants(count).subscribe(res => {
      this.merchants = res;
    });
  }

  removeMerchant(address: string) {
    this.contractService.removeMerchant(address).subscribe(res => {
      console.log('Merchant removed');
    });
  }

  refreshOnEvent() {
    this._ngZone.run(() => this.getMerchantCount());
  }

  checkInput(value) {
    this.newAddress.valid = this.web3Service.web3.isAddress(value);
    console.log(this.newAddress.valid);
  }
}
