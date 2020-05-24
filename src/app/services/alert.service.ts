import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Product } from '../models/product.model';
import { SqliteService } from './sqlite.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertctr:AlertController,
              private sqliteservice : SqliteService,
              private navCtrl:NavController,) { }


  // funcion para mostrar la informacion de un producto
    async getProduct(product:Product){
      const alert = await this.alertctr.create({
        header: 'informacion del Producto',
  
        inputs:[
          {
  
            value : 'Nombre: '+ product.name,
            disabled: true
          },
          {
            value : 'Precio: '+ product.price,
            disabled: true
          },
          {
            value :'Codigo: '+ product.code,
            disabled: true
          }
        ],
        buttons: [
          {
            text: 'Aceptar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }
        ]
      });
  
      await alert.present();
    }

// funcion para agregar un producto
  async addProduct(code){
    const alert = await this.alertctr.create({
      header: 'Informacion',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre',
        },
        {
          name: 'price',
          type: 'number',
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

  // mensaje de confirmacion
  async mensaje(mensaje:string){
    const alert = await this.alertctr.create({
      header: mensaje,
      buttons:[
        {
          text:'Ok',
          handler:() =>{
            this.navCtrl.navigateForward('/tabs/tab2');
          }
        }
      ]
    });
    await alert.present();
  }
}
