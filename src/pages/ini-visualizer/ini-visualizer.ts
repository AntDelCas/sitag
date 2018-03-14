import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { GeneralinfoPage, AppGlobals } from "../index.paginas";

import { GenericfunctionsProvider } from '../../providers/genericfunctions/genericfunctions';
//plugin
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@Component({
  selector: 'page-ini-visualizer',
  templateUrl: 'ini-visualizer.html',
})
export class IniVisualizerPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public genericFunction: GenericfunctionsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IniVisualizerPage');
  }


  start_scanning() {
    this.barcodeScanner.scan().then((barcodeData) => {
      console.log("Datos del scan: ", barcodeData.text);
      AppGlobals.PRODUCT_LABEL = barcodeData.text;

      if(this.genericFunction.check_isVisualizer(AppGlobals.PRODUCT_LABEL))
        this.navCtrl.push( GeneralinfoPage );
      else{
        let alert = this.alertCtrl.create({
          title: '¡Error!',
          subTitle: 'No tienes permisos para visualizar este producto.',
          buttons: ['OK']
        });
        alert.present();
      }
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
