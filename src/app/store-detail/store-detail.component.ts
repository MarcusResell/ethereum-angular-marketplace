import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { StoreService } from '../services/store.service';
import { Web3Service } from '../services/web3.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-store-detail',
  templateUrl: './store-detail.component.html',
  styleUrls: ['./store-detail.component.css']
})
export class StoreDetailComponent implements OnInit {
  storeId: number;
  store: any;
  productCount: number;
  productIds: Array<number>;
  products: any;

  newProduct = { name: '', description: '', price: 0, quantity: 0 };
  newProductSuccess = false;
  newProductWaitingForApproval = false;

  public updateForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private _ngZone: NgZone,
    private web3Ser: Web3Service,
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.storeId = +this.route.snapshot.paramMap.get('id');
    this.getStoreById(this.storeId);
    this.getStoreProductIds();
  }

  ngOnInit() {}

  setupForm(products: Array<any>) {
    const groups: Array<FormGroup> = products.map(product =>
      this.createItem(product[3], product[6])
    );
    this.updateForm = this.formBuilder.group({
      items: this.formBuilder.array(groups)
    });
  }

  createItem(price, quantity): FormGroup {
    return this.formBuilder.group({
      price: price,
      quantity: quantity
    });
  }

  get items(): FormArray {
    return this.updateForm.get('items') as FormArray;
  }

  getStoreById(id: number) {
    this.storeService.getStoreById(id).subscribe(res => {
      const storeArr = res.map(item => item.toString());
      const store = {
        id: storeArr[0],
        merchant: storeArr[1],
        name: storeArr[2],
        balance: this.priceInEther(storeArr[3])
      };
      this._ngZone.run(() => (this.store = store));
    });
  }

  updatePrice(value) {
    console.log(value);
  }

  addProduct() {
    if (
      this.newProduct.name.length === 0 ||
      this.newProduct.description.length === 0
    ) {
      return;
    }
    this.newProductWaitingForApproval = true;
    this.storeService
      .addProduct(
        this.store.id,
        this.newProduct.name,
        this.newProduct.description,
        this.newProduct.price,
        this.newProduct.quantity
      )
      .subscribe(
        res => {
          console.log(res);
          this.newProductWaitingForApproval = false;
          this.newProductSuccess = true;

          this.newProduct.name = '';
          this.newProduct.description = '';
          this.newProduct.price = 0;
          this.newProduct.quantity = 0;
          setTimeout(() => {
            this.newProductSuccess = false;
          }, 5000);
        },
        err => {
          console.log(err);
        }
      );
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
        console.log(res);
        const products = res.map(arr => arr.map(item => item.toString()));
        this.setupForm(products);
        this._ngZone.run(() => (this.products = products));
        console.log(products);
      },
      err => {
        console.log(err);
      }
    );
  }

  updateProduct(index: number) {
    const newValues = this.updateForm.controls['items']['controls'][index]
      .value;
    const oldPrice = this.products[index][3];
    const oldQuantity = this.products[index][6];
    const productId = +this.products[index][0];

    if (newValues.price === oldPrice && newValues.quantity === oldQuantity) {
      return;
    } else if (
      newValues.price !== oldPrice &&
      newValues.quantity === oldQuantity
    ) {
      // Change price
      this.storeService
        .updateProductPrice(productId, +newValues.price)
        .subscribe(res => console.log('Success'), err => console.log(err));
      console.log('change price');
    } else if (
      newValues.price === oldPrice &&
      newValues.quantity !== oldQuantity
    ) {
      // change quantity
      this.storeService
        .updateProductQuantity(productId, +newValues.quantity)
        .subscribe(res => console.log('Success'), err => console.log(err));
      console.log('change quantity');
    } else {
      // Change both
      this.storeService
        .updateProductPriceAndQuantity(
          productId,
          +newValues.price,
          +newValues.quantity
        )
        .subscribe(res => console.log('Success'), err => console.log(err));
      console.log('change both');
    }

    console.log(newValues);
  }

  deleteProduct(index: number) {
    const productToDeleteId = +this.products[index][0];
    this.storeService.deleteProduct(productToDeleteId).subscribe(
      res => {
        console.log('DELETE SUCCESS');
      },
      err => {
        console.log(err);
      }
    );
  }

  withdrawBalance() {
    this.storeService.withdrawStoreBalance(+this.store.id).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteStore() {
    this.storeService.deleteStore(+this.storeId).subscribe(
      res => {
        console.log(res);
        // Route
        this.location.back();
      },
      err => console.log(err)
    );
  }

  priceInEther(val): string {
    return this.web3Ser.web3.fromWei(val, 'ether');
  }
}
