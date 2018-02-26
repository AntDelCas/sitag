import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { IniVisualizerPage, IniRegisterPage, IniSuperuserPage } from "../index.paginas";

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

  nav_visualizer(){
    this.navCtrl.push ( IniVisualizerPage );
  }

  nav_register(){
    this.navCtrl.push ( IniRegisterPage );
  }

  nav_superuser(){
    this.navCtrl.push ( IniSuperuserPage );
  }


}
