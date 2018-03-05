import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppGlobals } from "../index.paginas";
import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';

@Component({
  selector: 'page-generalinfo',
  templateUrl: 'generalinfo.html',
})
export class GeneralinfoPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataAccess: DataaccessProvider) {
      // console.log(this.dataAccess.getGeneralInfo);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GeneralinfoPage');
  }
  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }
}
