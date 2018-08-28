import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { Web3Service } from './web3.service';

const storesArtifacts = require('../../../build/contracts/MarketplaceStores.json');

import * as contract from 'truffle-contract';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  MarketplaceStores = contract(storesArtifacts);
  constructor(private web3Ser: Web3Service) {
    this.MarketplaceStores.setProvider(web3Ser.web3.currentProvider);
  }

  createStore(name: string): Observable<any> {
    let stores;

    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          // we use call here so the call doesn't try and write, making it free
          return stores.createStore(name, { from: this.fromAddr() });
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  getStoreIdsByMerchant(): Observable<any> {
    let stores;

    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          console.log(this.fromAddr());
          // we use call here so the call doesn't try and write, making it free
          return stores.getStoreIdsByMerchant(this.fromAddr());
        })
        .then(value => {
          observer.next(value.map(item => item.toString()));
          observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  getStoreById(storeId: number): Observable<any> {
    let stores;

    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          console.log(this.fromAddr());
          // we use call here so the call doesn't try and write, making it free
          return stores.getStoreById(storeId);
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  getAllMerchantStores(storeIds: number[]): Observable<any> {
    let stores;
    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          const promises = [];
          for (let i = 0; i < storeIds.length; i++) {
            promises.push(stores.getStoreById.call(storeIds[i]));
          }

          return Promise.all(promises);
          // stores.items(0).then(res => {
          //   console.log(res);
          // });
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
        });
    });
  }

  addProduct(
    storeId: number,
    name: string,
    description: string,
    price: number,
    quantity: number
  ): Observable<any> {
    let store;

    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          store = instance;
          // const priceInWei = this.web3Ser.web3.toWei(price, 'ether');
          // we use call here so the call doesn't try and write, making it free
          return store.addProduct(storeId, name, description, price, quantity, {
            from: this.fromAddr()
          });
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  getStoreProductIds(storeId: number): Observable<any> {
    let stores;
    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          return stores.getProductIdsInStore.call(storeId);
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
        });
    });
  }

  getStoreCount(): Observable<any> {
    let stores;
    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          return stores.getStoreCount.call();
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
        });
    });
  }

  getAllStoreProducts(productIds: number[]): Observable<any> {
    let stores;
    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          const promises = [];
          for (let i = 0; i < productIds.length; i++) {
            promises.push(stores.getProductById.call(productIds[i]));
          }

          return Promise.all(promises);
          // stores.items(0).then(res => {
          //   console.log(res);
          // });
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
        });
    });
  }

  updateProductPrice(productId: number, price: number): Observable<any> {
    let stores;

    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          return stores.updateProductPrice(productId, price, {
            from: this.fromAddr()
          });
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  updateProductQuantity(productId: number, quantity: number): Observable<any> {
    let stores;

    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          return stores.updateProductQuantity(productId, quantity, {
            from: this.fromAddr()
          });
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  updateProductPriceAndQuantity(
    productId: number,
    price: number,
    quantity: number
  ): Observable<any> {
    let stores;

    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          return stores.updateProductPriceAndQuantity(
            productId,
            price,
            quantity,
            {
              from: this.fromAddr()
            }
          );
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  deleteProduct(productId: number): Observable<any> {
    let stores;

    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          return stores.deleteProduct(productId, {
            from: this.fromAddr()
          });
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  buyProduct(
    productId: number,
    quantity: number,
    price: number
  ): Observable<any> {
    let stores;

    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          return stores.buyProduct(productId, quantity, {
            from: this.fromAddr(),
            value: price
          });
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  deleteStore(storeId: number): Observable<any> {
    let stores;

    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          return stores.removeStore(storeId, {
            from: this.fromAddr()
          });
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  withdrawStoreBalance(storeId: number) {
    let stores;

    return Observable.create(observer => {
      this.MarketplaceStores.deployed()
        .then(instance => {
          stores = instance;
          return stores.withdrawStoreBalance(storeId, {
            from: this.fromAddr()
          });
        })
        .then(value => {
          observer.next(value);
          observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  private fromAddr() {
    return this.web3Ser.web3.eth.accounts[0];
  }
}
