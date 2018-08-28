import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  storeId: number;
  store: any;
  productIds = [];
  products = [];
  showApproveInformation = null;
  showSuccessInformation = null;
  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private _ngZone: NgZone
  ) {
    this.storeId = +this.route.snapshot.paramMap.get('id');
    this.getStoreById(this.storeId);
    this.getStoreProductIds();
  }

  ngOnInit() {}

  buyItem(itemIndex, price) {
    this.showApproveInformation = itemIndex;
    this.storeService.buyProduct(+itemIndex, 1, +price).subscribe(
      res => {
        console.log(res);
        this.showApproveInformation = null;
        setTimeout(() => {
          this.showSuccessInformation = itemIndex;
        }, 5000);
      },
      err => {
        console.log(err);
        this.showApproveInformation = null;
      }
    );
  }

  getStoreById(id: number) {
    this.storeService.getStoreById(id).subscribe(res => {
      const storeArr = res.map(item => item.toString());
      const store = {
        id: storeArr[0],
        merchant: storeArr[1],
        name: storeArr[2],
        balance: storeArr[3]
      };
      this._ngZone.run(() => (this.store = store));
    });
  }

  getStoreProductIds() {
    this.storeService.getStoreProductIds(this.storeId).subscribe(
      res => {
        this.productIds = res.map(item => parseInt(item.toString(), 10));
        this.getStoreProducts();
      },
      err => {
        console.log(err);
      }
    );
  }

  getStoreProducts() {
    this.storeService.getAllStoreProducts(this.productIds).subscribe(
      res => {
        const products = res.map(arr => arr.map(item => item.toString()));
        this._ngZone.run(() => (this.products = products));
      },
      err => {
        console.log(err);
      }
    );
  }
}
