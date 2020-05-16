import { Component, OnInit} from '@angular/core';
import {Product} from '../models/product.model';
import { AlertController } from '@ionic/angular';
import {SqliteService} from '../services/sqlite.service'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  products : Product[] = [];
  constructor(private alertctr:AlertController,
              private sqliteService : SqliteService) {
  }

  ionViewWillEnter() {
    this.getProducts();
  } 
  // BASE DE DATOS
  
  async getProducts(){
   this.products = await this.sqliteService.getProducts() || [];
   console.log('productos desde el tab2 ',this.products)
  }

  deleteAll(){
    console.log('todo borrado')
  }

  openProduct(product:Product){
    console.log('abriendo el producto ',product)
  }

  async deleteAlert(product:Product){
    const alert = await this.alertctr.create({
      header: '¿Seguro desea eliminar?',

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.sqliteService.deleteProduct(product)
            .then(()=> {
              console.log('producto eliminado');
              this.getProducts();
            })
          }
        }
      ]
    });

    await alert.present();
  }

  async updateAlert(product:Product){
    const alert = await this.alertctr.create({
      header: 'Actualizar Producto',

      inputs:[
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre',
          value : product.name
        },
        {
          name: 'price',
          type: 'text',
          placeholder: 'precio',
          value : product.price
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
        },
        {
          text: 'Ok',
          handler: (data) => {
            let name = data.name;
            let price = data.price;
            const NewProduct = new Product(product.code,name,price);
            this.sqliteService.updateProduct(NewProduct)
            .then(data => {
              console.log('producto editado',data)
              this.getProducts();
            })
            .catch(err => console.log('error al editar producto',err))
          }
        }
      ]
    });

    await alert.present();
  }
}
