import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppGlobals } from "../index.paginas";

@Component({
  selector: 'page-customize',
  templateUrl: 'customize.html',
})
export class CustomizePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomizePage');
  }
  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }
}
