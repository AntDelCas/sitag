import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { RegisterPage, RegisterdirectoryPage, GeneralinfoPage, AppGlobals } from "../index.paginas";

import { GenericfunctionsProvider } from '../../providers/genericfunctions/genericfunctions';
//plugin
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-ini-register',
  templateUrl: 'ini-register.html',
})
export class IniRegisterPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public genericFunction: GenericfunctionsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IniRegisterPage');
  }

  start_register() {
    this.barcodeScanner.scan().then((barcodeData) => {
      console.log("Datos del scan: ", barcodeData.text);
      AppGlobals.PRODUCT_LABEL = barcodeData.text;

      //Comprueba si tiene permisos para registrar el producto que se ha escaneado:
      if(this.genericFunction.check_hasPermissions())
          this.navCtrl.push( RegisterPage );
      else
        this.navCtrl.push( GeneralinfoPage );
    }, (err) => {
      console.error("Error: ", err);
      this.genericFunction.mostrar_toast("Error del scan: " + err);
    });
  }

  register_directory() {
    this.navCtrl.push( RegisterdirectoryPage );
  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }

}
