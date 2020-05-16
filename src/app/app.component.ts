import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import {SqliteService} from'./services/sqlite.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public Sqlite : SQLite,
    public slqservice : SqliteService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.createDataBase();
    });
  }

  createDataBase(){
    this.Sqlite.create({
      name:'data.db',
      location:'default'
    })
    .then((db)=>{
      this.slqservice.setDataBase(db);
      return this.slqservice.createTables()
      .then(data => console.log('tabla creada con exito',data))
      .catch(err => console.log('error al crear la tabla',err));
    })
    .catch(err =>{
      console.log('error al crear base de datos',err)
    })
  }
}
