import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { Web3Service } from './web3.service';

const marketplaceArtifacts = require('../../../build/contracts/Marketplace.json');

import * as contract from 'truffle-contract';
import { AppState } from '../state/app.state';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  SupplyChain = contract(marketplaceArtifacts);
  constructor(private web3Ser: Web3Service) {
    this.SupplyChain.setProvider(web3Ser.web3.currentProvider);
  }

  isAdministrator(address: string): Observable<any> {
    let supplyChain;

    return Observable.create(observer => {
      this.SupplyChain.deployed()
        .then(instance => {
          supplyChain = instance;
          // we use call here so the call doesn't try and write, making it free
          return supplyChain.isAdministrator(address);
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

  addMerchant(address: string): Observable<any> {
    let marketplace;

    return Observable.create(observer => {
      this.SupplyChain.deployed()
        .then(instance => {
          marketplace = instance;
          const checkSumAddress = this.web3Ser.web3.toChecksumAddress(address);
          // we use call here so the call doesn't try and write, making it free
          return marketplace.createStoreOwner(checkSumAddress, {
            from: this.fromAddr()
          });
        })
        .then(value => {
          observer.next('SUCCESS');
          observer.complete();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  isStorekeeper(address: string): Observable<any> {
    let supplyChain;

    return Observable.create(observer => {
      this.SupplyChain.deployed()
        .then(instance => {
          supplyChain = instance;
          // we use call here so the call doesn't try and write, making it free
          return supplyChain.isStoreOwner(address);
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

  getMerchantCount(): Observable<number> {
    let marketplace;
    return Observable.create(observer => {
      this.SupplyChain.deployed()
        .then(instance => {
          marketplace = instance;
          // we use call here so the call doesn't try and write, making it free
          return marketplace.getNumberOfMerchants.call();
        })
        .then(value => {
          observer.next(parseInt(value.toString(), 10));
          observer.complete();
        })
        .catch(e => {
          console.log(e);
        });
    });
  }

  getMerchants(count: number): Observable<any> {
    let marketplace;
    return Observable.create(observer => {
      this.SupplyChain.deployed()
        .then(instance => {
          marketplace = instance;
          const promises = [];
          for (let i = 0; i < count; i++) {
            promises.push(marketplace.getMerchantByArrayId(i));
          }

          return Promise.all(promises);
          // supplyChain.items(0).then(res => {
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

  removeMerchant(address: string): Observable<any> {
    let marketplace;
    return Observable.create(observer => {
      this.SupplyChain.deployed()
        .then(instance => {
          marketplace = instance;
          const checkSumAddress = this.web3Ser.web3.toChecksumAddress(address);
          // we use call here so the call doesn't try and write, making it free
          return marketplace.removeMerchant(checkSumAddress, {
            from: this.fromAddr()
          });
        })
        .then(value => {
          observer.next(parseInt(value.toString(), 10));
          observer.complete();
        })
        .catch(e => {
          console.log(e);
        });
    });
  }

  // listen() {
  //   let supplyChain;
  //   this.SupplyChain.deployed().then(instance => {
  //     supplyChain = instance;
  //     let events = supplyChain.ForSale();
  //     events.watch(function(error, event) {
  //       console.log('HAJHAJ');
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         let eventRet = event;
  //         console.log(eventRet);
  //       }
  //     });
  //   });
  // }
}
