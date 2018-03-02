import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppGlobals } from "../index.paginas";


@Component({
  selector: 'page-registerreport',
  templateUrl: 'registerreport.html',
})
export class RegisterreportPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterreportPage');
  }
  
  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }
}
