import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import {Product} from '../models/product.model';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  db:SQLiteObject = null;
  prod : Product[] = [];
  constructor(private navCtrl:NavController) { 
  }

  setDataBase(db:SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  createTables(){
    let query = 'CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, name TEXT, price TEXT)';
    return this.db.executeSql(query,[]);
  }

  getProducts(){
    let query = 'SELECT * FROM products';
    return this.db.executeSql(query,[])
    .then(response => {
      let products = [];
      for (let i = 0; i < response.rows.length; i++) {
          products.unshift(response.rows.item(i));   
          console.log('mostrando los productos de la bd',response.rows.item(i))  
      }
      return Promise.resolve(products)
    }).catch(error => {
      return Promise.reject(error)
    })
  }

  addProduct(product:Product){
    let query = 'INSERT INTO products(code,name,price) VALUES (?,?,?)';
    return this.db.executeSql(query,[product.code,product.name,product.price]);

  }

  updateProduct(product:Product){
    console.log('mostrando el producto a editar',product);

    let querybuscar = 'SELECT * FROM products WHERE code = ?';
    this.db.executeSql(querybuscar,[])
    .then((data)=>{
      console.log('producto encontrado en la bd',data)
    })
    .catch(err => console.log('error al encontrar el producto en la bd',err));

   
    let query = 'UPDATE products set code = ?, name = ?, price = ? WHERE code = ?';
    return this.db.executeSql(query,[product.code,product.name,product.price,product.code]);
  }

  deleteProduct(product:Product){
    let query = 'DELETE FROM products WHERE id = ?';
    return this.db.executeSql(query,[product.id])
  }
}
