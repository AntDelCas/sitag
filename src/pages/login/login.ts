import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { IniVisualizerPage, IniRegisterPage, IniSuperuserPage } from "../index.paginas";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  nav_home(){
    this.navCtrl.pop();
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
