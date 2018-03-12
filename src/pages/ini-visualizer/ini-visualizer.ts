import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { GeneralinfoPage, AppGlobals, ToastController } from "../index.paginas";

//plugin
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@Component({
  selector: 'page-ini-visualizer',
  templateUrl: 'ini-visualizer.html',
})
export class IniVisualizerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IniVisualizerPage');
  }


  start_scanning() {

    //this.navCtrl.push( GeneralinfoPage );
    console.log("Realizando escaneo ...");

    this.barcodeScanner.scan().then((barcodeData) => {
      console.log("Datos del scan: ", barcodeData.text);
      this.mostrar_toast("Datos del scan: " + barcodeData.text);
    }, (err) => {
      console.error("Error: ", err);
      this.mostrar_toast("Error del scan: " + err);
    });

  }


  //Devuelve el nickname:
  get getUsername() {
    return AppGlobals.USER;
  }


  //mostrar ToastController
  mostrar_toast(mensaje: string) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();

  }



}
