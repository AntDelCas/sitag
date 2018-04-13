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
  /** @description: Cabecera inicial de la aplicación: */
  texto_cabecera: string = AppGlobals.TEXTO_CABECERA;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    public alertCtrl: AlertController,
    public genericFunction: GenericfunctionsProvider) {
  }

  /**
    * @name: start_scanning()
    * @description: Escanea un código QR, comprueba si el usuario escaneando tiene permisos para visualizar ese producto. Guarda la etiqueta escaneada en la variable
    * AppGlobals.PRODUCT_LABEL
    */
  start_scanning() {
    this.barcodeScanner.scan().then((barcodeData) => {
      AppGlobals.PRODUCT_LABEL = barcodeData.text;

      if(this.genericFunction.check_isVisualizer(AppGlobals.PRODUCT_LABEL))
        this.navCtrl.push( GeneralinfoPage );
      else{
        let alert = this.alertCtrl.create({
          title: '¡Error!',
          subTitle: 'No tienes permisos para visualizar este producto.',
          message: "Etiqueta: " + AppGlobals.PRODUCT_LABEL,
          buttons: ['OK']
        });
        alert.present();
      }
    }, (err) => {
      console.error("Error: ", err);
      this.genericFunction.mostrar_toast("Error del scan: " + err);
    });
  }

  /**
    * @name: getUsername()
    * @description: Devuelve el nick del usuario que está validado en la aplicación.
    */
  get getUsername() {
    return AppGlobals.USER;
  }

  /**
    * @name: backHome()
    * @description: Navega hacia la interfaz de selección de tipo de usuario.
    */
  backHome(){
    this.navCtrl.push ( LoginAsPage );
  }
}
