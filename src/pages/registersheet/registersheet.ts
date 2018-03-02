import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppGlobals } from "../index.paginas";


@Component({
  selector: 'page-registersheet',
  templateUrl: 'registersheet.html',
})
export class RegistersheetPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistersheetPage');
  }
  
  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }
}
