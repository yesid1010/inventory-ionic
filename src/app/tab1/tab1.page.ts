import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {SqliteService} from '../services/sqlite.service'
import { Product } from '../models/product.model';
import {AlertService} from '../services/alert.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor( private bs : BarcodeScanner,
               private sqliteservice : SqliteService,
               private alerService : AlertService) {}

  save(){
    this.bs.scan()
    .then(barcodeData => {
      console.log('barcodeData',barcodeData)
      if(!barcodeData.cancelled){
        this.sqliteservice.getProduct(barcodeData.text)
        .then((data)=>{
          if(data.length > 0){
            const NewProduct = new Product(data[0].code,data[0].name,data[0].price);
            this.alerService.getProduct(NewProduct)
          }else{
            this.alerService.addProduct(barcodeData.text);
          }
        })
        
      }
      
    })
    .catch(err => console.log('error al usar scanner ',err))
  }
}
