import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { GeneralinfoPage, AppGlobals, LoginAsPage } from "../index.paginas";

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
    public alertCtrl: AlertController,
    public genericFunction: GenericfunctionsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IniVisualizerPage');
  }

  start_scanning() {
    //TODO: Modo testeo, descomentar este código
    // this.barcodeScanner.scan().then((barcodeData) => {
    //   console.log("Datos del scan: ", barcodeData.text);
    //   AppGlobals.PRODUCT_LABEL = barcodeData.text;

      // if(this.genericFunction.check_isVisualizer(AppGlobals.PRODUCT_LABEL))
        this.navCtrl.push( GeneralinfoPage );
      // else{
      //   let alert = this.alertCtrl.create({
      //     title: '¡Error!',
      //     subTitle: 'No tienes permisos para visualizar este producto.',
      //     buttons: ['OK']
      //   });
      //   alert.present();
      // }
    // }, (err) => {
    //   console.error("Error: ", err);
    //   this.genericFunction.mostrar_toast("Error del scan: " + err);
    // });
  }

  //Devuelve el nickname:
  get getUsername() {
    return AppGlobals.USER;
  }

  backHome(){
    this.navCtrl.push ( LoginAsPage );
  }
}
