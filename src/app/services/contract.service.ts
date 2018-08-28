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
  Marketplace = contract(marketplaceArtifacts);
  constructor(private web3Ser: Web3Service) {
    this.Marketplace.setProvider(web3Ser.web3.currentProvider);
  }

  isAdministrator(address: string): Observable<any> {
    let marketplace;

    return Observable.create(observer => {
      this.Marketplace.deployed()
        .then(instance => {
          marketplace = instance;
          // we use call here so the call doesn't try and write, making it free
          return marketplace.isAdministrator(address);
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
      this.Marketplace.deployed()
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
    let marketplace;

    return Observable.create(observer => {
      this.Marketplace.deployed()
        .then(instance => {
          marketplace = instance;
          // we use call here so the call doesn't try and write, making it free
          return marketplace.isStoreOwner(address);
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
      this.Marketplace.deployed()
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
      this.Marketplace.deployed()
        .then(instance => {
          marketplace = instance;
          const promises = [];
          for (let i = 0; i < count; i++) {
            promises.push(marketplace.getMerchantByArrayId(i));
          }

          return Promise.all(promises);
          // marketplace.items(0).then(res => {
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
      this.Marketplace.deployed()
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

  listen() {
    let marketplace;
    this.Marketplace.deployed().then(instance => {
      marketplace = instance;
      let event = marketplace.AdminCreated();
      event.watch(function(error, value) {
        console.log('HAJHAJ');
        if (error) {
          console.log(error);
        } else {
          let eventRet = value;
          console.log(eventRet);
        }
      });
    });
  }
}
