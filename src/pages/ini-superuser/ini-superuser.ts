import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { GeneralinfoPage, RegisterdirectoryPage, CustomizePage, ConfigPage, RegisterPage } from "../index.paginas";

@Component({
  selector: 'page-ini-superuser',
  templateUrl: 'ini-superuser.html',
})
export class IniSuperuserPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IniSuperuserPage');
  }

  download_schemas() {

  }

  customize() {
    this.navCtrl.push(CustomizePage);
  }

  start_register() {
    this.navCtrl.push(RegisterPage);

  }

  start_sacanning() {
    this.navCtrl.push(GeneralinfoPage);
  }

  config() {
    this.navCtrl.push(ConfigPage);
  }

  register_directory() {
    this.navCtrl.push(RegisterdirectoryPage);
  }






}
