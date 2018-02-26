import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { GeneralinfoPage } from "../index.paginas";

@Component({
  selector: 'page-ini-visualizer',
  templateUrl: 'ini-visualizer.html',
})
export class IniVisualizerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IniVisualizerPage');
  }


  start_scanning() {
    this.navCtrl.push( GeneralinfoPage );
  }

}
