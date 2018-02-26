import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { GeneralinfoPage, RegisterdirectoryPage } from "../index.paginas";


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

  start_scanning() {
    this.navCtrl.push( GeneralinfoPage );
  }

  register_directory() {
    this.navCtrl.push( RegisterdirectoryPage );
  }




}
