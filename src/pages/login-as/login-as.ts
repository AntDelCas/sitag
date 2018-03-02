import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { IniVisualizerPage, IniRegisterPage, IniSuperuserPage, AppGlobals, LoginPage } from "../index.paginas";

@Component({
  selector: 'page-login-as',
  templateUrl: 'login-as.html',
})
export class LoginAsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginAsPage');
  }



  //Según el o los roles que lleguen del ws, se mostrarán 1, 2 ó los 3 botones.
  nav_visualizer(){
    this.navCtrl.push ( IniVisualizerPage );
  }

  nav_register(){
    this.navCtrl.push ( IniRegisterPage );
  }

  nav_superuser(){
    this.navCtrl.push ( IniSuperuserPage );
  }

  logOff(){
    this.navCtrl.push ( LoginPage );
  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }

}
