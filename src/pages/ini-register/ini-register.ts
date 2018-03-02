import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RegisterPage, RegisterdirectoryPage, AppGlobals } from "../index.paginas";


@Component({
  selector: 'page-ini-register',
  templateUrl: 'ini-register.html',
})
export class IniRegisterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IniRegisterPage');
  }

  start_register() {
    this.navCtrl.push( RegisterPage );
  }

  register_directory() {
    this.navCtrl.push( RegisterdirectoryPage );
  }


  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }

}
