import { Component} from '@angular/core';
import {Product} from '../models/product.model';
import {SqliteService} from '../services/sqlite.service';
import {AlertService} from '../services/alert.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  products : Product[] = [];

  constructor(private sqliteService : SqliteService,
              private alerService : AlertService,
              private alertctr:AlertController,) {
  }

  ionViewWillEnter() {
     this.getProducts();
  } 

  // Buscar producto
   BuscarProducto(event){
    //this.getProducts()

    let producto = event.target.value;

    if(!producto){
      return this.getProducts();
    }

    this.products = this.products.filter((item=>{
      if(item.name && producto){
        return (item.name.toLowerCase().indexOf(producto.toLowerCase())>-1)
      }
      
    }))

    
  }

  //traer todos los productos
  async getProducts(){
   this.products = await this.sqliteService.getProducts() || [];
   console.log('productos desde el tab2 ',this.products)
  }

//abrir un producto
  openProduct(product:Product){
    this.alerService.getProduct(product);
  }


  /// funcion para eliminar un producto
  async deleteProduct(product:Product){
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
              this.getProducts();
            })
            .catch(err => console.log('ha ocurrido un error al eliminar el producto',err))
          }
        }
      ]
    });

    await alert.present();
  }
  

  /// actualizar un producto
  async updateProduct(product:Product){
    const alert = await this.alertctr.create({
      header: 'Actualizar Producto',

      inputs:[
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre',
          value : product.name,
          max: 15,
          min:3
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'precio',
          value : product.price,
          max: 7,
          min:3
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
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

  exportDataBase(){
    this.sqliteService.ExportDataBase()
  }

  importDataBase(){
    this.sqliteService.importDataBase().then((data)=>{
      if(data == 0){
        this.alerService.mensaje('Archivo no compatible');
        console.log(data);
      }else{
        if(data == 1){
        this.alerService.mensaje('Base de datos importada');
        console.log(data);
        this.getProducts()
        }
      }
    }) 
  }

  async DeleteAllProducts(){
    const alert = await this.alertctr.create({
      header:'¿Seguro que desea eliminar todos los productos?',
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.sqliteService.deleteAllProducts()
            .then(()=>{
              this.getProducts();
            })
            .catch(err => console.log('ha ocurrido un error al eliminar los productos',err))
            
          }      
        }
    ]
    })
    await alert.present();
  }
}
