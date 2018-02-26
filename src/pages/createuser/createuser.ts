import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-createuser',
  templateUrl: 'createuser.html',
})
export class CreateuserPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateuserPage');
  }


  register() {


  }

  cancel_register() {
    this.navCtrl.pop();
  }



}
