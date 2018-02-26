import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoginAsPage, CreateuserPage } from "../index.paginas";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  login(){
    this.navCtrl.push ( LoginAsPage );
  }

  createaccount(){
    this.navCtrl.push ( CreateuserPage );
  }


}
