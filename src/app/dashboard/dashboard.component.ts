import { Component, OnInit, NgZone } from '@angular/core';
import { ContractService } from '../services/contract.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stores = [];
  constructor(private storeService: StoreService, private _ngZone: NgZone) {
    this.getStoreCount();
  }

  ngOnInit() {}

  // Get store fronts
  getStoreCount() {
    this.storeService.getStoreCount().subscribe(res => {
      this.getAllStores(+res.toString());
    });
  }

  getAllStores(count: number) {
    const arr = Array.from(Array(count).keys());
    this.storeService.getAllMerchantStores(arr).subscribe(
      res => {
        const stores = [];
        res.forEach(entry => {
          const store = {
            id: +entry[0].toString(),
            merchant: entry[1],
            name: entry[2],
            balance: +entry[3].toString()
          };
          stores.push(store);
        });
        this._ngZone.run(() => (this.stores = stores));
      },
      err => {
        console.log(err);
      }
    );
  }
}
