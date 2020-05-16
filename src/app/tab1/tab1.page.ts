import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {SqliteService} from '../services/sqlite.service'
import { Product } from '../models/product.model';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor( private bs : BarcodeScanner,
               private sqliteservice : SqliteService,
               private navCtrl:NavController,
               private alt:AlertController) {}


  save(){
    this.bs.scan()
    .then(barcodeData => {
      console.log('barcodeData',barcodeData)
      if(!barcodeData.cancelled){
        this.addProduct(barcodeData.text);
      }
      
    })
    .catch(err => console.log('error al usar scanner ',err))
  }

  search(){
    console.log('buscando');
  }


  async addProduct(code){
    const alert = await this.alt.create({
      header: 'Informacion',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre'
        },
        {
          name: 'price',
          type: 'text',
          placeholder: 'Precio'
        }

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            let name = data.name;
            let price = data.price;
            const NewProduct = new Product(code,name,price);
                    
            this.sqliteservice.addProduct(NewProduct)
            .then(product =>{
              console.log('producto agregado',product);
              this.navCtrl.navigateForward('/tabs/tab2');
            })
            .catch(err => console.log('ha ocurrido un error al guadar el producto',err))

          }
        }
      ]
    });

    await alert.present();
  }
}
