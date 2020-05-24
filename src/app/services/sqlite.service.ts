import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import {Product} from '../models/product.model';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { NavController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  db:SQLiteObject = null;
  prod : Product[] = [];
  constructor(private file: File,
              private sqlitePorter: SQLitePorter,
              private social:SocialSharing,
              private fileChooser: FileChooser,
              private filePath: FilePath,
              private navCtrl:NavController) { 
  }

  // creamos la base de datos 
  setDataBase(db:SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  //creamos la tabla productos vacìa
  createTables(){
    let query = 'CREATE TABLE IF NOT EXISTS products(code TEXT PRIMARY KEY, name TEXT, price TEXT)';
    return this.db.executeSql(query,[]);
  }

  //obtenemos todos los productos
  getProducts(){
    let query = 'SELECT * FROM products';
    return this.db.executeSql(query,[])
    .then(response => {
      let products = [];
      for (let i = 0; i < response.rows.length; i++) {
          products.unshift(response.rows.item(i));    
      }
      return Promise.resolve(products)
    }).catch(error => {
      return Promise.reject(error)
    })
  }

  // agregamos un producto a la base de datos
  addProduct(product:Product){
    let query = 'INSERT INTO products(code,name,price) VALUES (?,?,?)';
    return this.db.executeSql(query,[product.code,product.name,product.price]);

  }

  //actualizamos un producto
  updateProduct(product:Product){
    let query = 'UPDATE products set code = ?, name = ?, price = ? WHERE code = ?';
    return this.db.executeSql(query,[product.code,product.name,product.price,product.code]);
  }

  //eliminamos un producto
  deleteProduct(product:Product){
    let query = 'DELETE FROM products WHERE code = ?';
    return this.db.executeSql(query,[product.code])
  }

  //obtenemos un producto
  getProduct(code:string){
    let query = 'SELECT * FROM products WHERE code = ?';
    return this.db.executeSql(query,[code])
    .then(response => {
      let products = [];
      for (let i = 0; i < response.rows.length; i++) {
          products.unshift(response.rows.item(i));    
      }
      return Promise.resolve(products)
    }).catch(error => {
      return Promise.reject(error)
    })
  }

  //exportamos la base de datos
  ExportDataBase(){
   return this.sqlitePorter.exportDbToSql(this.db)
   .then(data => {
     this.crearArchivo(data)
   })
  }

  //importamos la base de datos
  importDataBase(){
  return  this.fileChooser.open() // abrimos el explorador de archivos 
            .then( path => {
            return  this.filePath.resolveNativePath(path) // obtenemos la ruta nativa del archivo seleccionado
              .then(path => {
                const ruta = path.slice(0,-13); // cortamos el nombre de ese archivo de la ruta
              return  this.file.readAsText(ruta,'productos.txt') // leemos el archivo
                .then(data =>{
                  const datae = data.slice(100);// cortamos del archivo la instruccion de borrar la tabla
                   this.sqlitePorter.importSqlToDb(this.db,datae) // importamos la base de datos traida en el archivo
                     return 1;  
                })
                .catch(err => { 
                  console.log('error al leer data',err)
                  return 0;
                })
              })
              .catch(err => console.log('error con el filepath',err))
            })
            .catch(err => console.log('error al abrir archivo',err))
  }

  // funcion para crear un archivo fisico txt
  crearArchivo(text:string){
    this.file.checkFile(this.file.dataDirectory,'productos.txt')
    .then(() => {
      return this.escribirArchivo(text)
    })
    .catch(err => { 
      return this.file.createFile(this.file.dataDirectory,'productos.txt',false)
              .then(() => this.escribirArchivo(text))
              .catch(err => console.log('error al crear archivo',err))
    })
  }

// funcion para excribir sobre ese archivo
  async escribirArchivo(text: string) {
    await this.file.writeExistingFile(this.file.dataDirectory,'productos.txt',text);
    const archivo = `${this.file.dataDirectory}/productos.txt`;

    this.social.share('backup data base','backup data base',archivo)
    .then( data =>{
      console.log('archivo enviado',data)
    })
    .catch(err => console.log('error al compartir archivo',err))

  }

  //eliminar todos loss productos

  deleteAllProducts(){
    let query = 'DROP TABLE IF EXISTS products; CREATE TABLE products(code TEXT PRIMARY KEY, name TEXT, price TEXT);';
    this.sqlitePorter.importSqlToDb(this.db,query);

    console.log('eliminando desde sqlite');
    return this.navCtrl.navigateForward('/tabs/tab2')
  }
}
