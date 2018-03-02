import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoginAsPage, CreateuserPage, AppGlobals } from "../index.paginas";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username : string;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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

      //Las credenciales son válidas:
      // if((this.username == entry.username) && (this.password == entry.address.geo.lng)){
      //   AppGlobals.USER = entry.username;
      //   this.navCtrl.push ( LoginAsPage );
      // }
      // //Fallo en la validación:
      // else{
      //
      // }
    }//for
    this.navCtrl.push ( LoginAsPage );
  }

  createaccount(){
    this.navCtrl.push ( CreateuserPage );
  }


}
