import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoginAsPage } from "../index.paginas";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  nav_login(){
    this.navCtrl.push ( LoginAsPage );
  }

  nav_home(){
    this.navCtrl.pop();
  }


}
