import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { GeneralinfoPage } from "../index.paginas";

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

  download_schemas(){

  }

  customize(){

  }

  start_registering(){

  }

  start_sacanning() {
    this.navCtrl.push( GeneralinfoPage );
  }

  config(){

  }

  register_directory(){

  }






}
