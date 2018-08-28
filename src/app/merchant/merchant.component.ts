import { Component, OnInit, NgZone } from '@angular/core';
import { StoreService } from '../services/store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.css']
})
export class MerchantComponent implements OnInit {
  stores = [];
  newStoreName = '';
  success = false;
  waitingForApproval = false;

  constructor(private storeService: StoreService, private _ngZone: NgZone) {
    this.getMyStoreIds();
  }

  ngOnInit() {}

  createStore() {
    if (this.newStoreName.length === 0) {
      return;
    }

    this.waitingForApproval = true;

    this.storeService.createStore(this.newStoreName).subscribe(res => {
      this.waitingForApproval = false;
      this.success = true;
      setTimeout(() => {
        this.success = false;
      }, 5000);
    });
  }

  getMyStoreIds() {
    this.storeService.getStoreIdsByMerchant().subscribe(res => {
      this.getAllMyStores(res);
    });
  }

  getAllMyStores(storeIds) {
    const ids = storeIds.map(id => parseInt(id, 10));
    this.storeService.getAllMerchantStores(ids).subscribe(res => {
      const stores = res.map(arr => arr.map(item => item.toString()));
      this._ngZone.run(() => (this.stores = stores));
    });
  }
}
