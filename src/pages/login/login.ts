import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { HomePage, LoginAsPage, CreateuserPage, AppGlobals } from "../index.paginas";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username : string;
  password: string;
  isValidLogin: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController) {
  }

  //Comprueba si el login es válido:
  login(){
    console.log(this.password)
    //Itera los datos cargados en memoria:
    for (let entry of AppGlobals.USERS_LIST) {
      console.log(entry.address.geo.lng)

      //Cambiar cuando esté el JSON real
      //entry.users.user
      //entry.users.password

      // Las credenciales son válidas:
      if((this.username == entry.username) && (this.password == entry.address.geo.lng)){
        AppGlobals.USER = entry.username;
        this.navCtrl.push ( LoginAsPage );
        this.isValidLogin = true;
      }

    }//for
    // this.navCtrl.push ( LoginAsPage );

    //Fallo en la validación:
    if(!this.isValidLogin){
    //Alerta del fallo de validación:
      let alert = this.alertCtrl.create({
        title: '¡Error!',
        subTitle: 'Usuario o contraseña incorrectos.',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  createaccount(){
    this.navCtrl.push ( CreateuserPage );
  }

  nav_home(){
    this.navCtrl.push ( HomePage );
  }
}
