import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RegistersheetPage, RegisterreportPage, AppGlobals } from "../index.paginas";

@Component({
  selector: 'page-registerdirectory',
  templateUrl: 'registerdirectory.html',
})

export class RegisterdirectoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterdirectoryPage');
  }


  open_register_sheet() {
    this.navCtrl.push( RegistersheetPage );
  }

  send_register_sheet() {

  }

  open_register_report() {
    this.navCtrl.push( RegisterreportPage );
  }

  send_register_report() {

  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }


}
