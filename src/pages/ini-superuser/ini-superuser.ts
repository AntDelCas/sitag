import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { GeneralinfoPage, RegisterdirectoryPage, CustomizePage, ConfigPage, RegisterPage, AppGlobals } from "../index.paginas";

import { GenericfunctionsProvider } from '../../providers/genericfunctions/genericfunctions';
//plugin
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-ini-superuser',
  templateUrl: 'ini-superuser.html',
})
export class IniSuperuserPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public genericFunction: GenericfunctionsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IniSuperuserPage');
  }

  download_schemas() {

  }

  customize() {
    this.navCtrl.push(CustomizePage);
  }

  start_register() {
    this.barcodeScanner.scan().then((barcodeData) => {
      console.log("Datos del scan: ", barcodeData.text);
      AppGlobals.PRODUCT_LABEL = barcodeData.text;

      //Comprueba si tiene permisos para registrar el producto que se ha escaneado:
      if(this.genericFunction.check_hasPermissions())
          this.navCtrl.push( RegisterPage );
      else
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
      this.genericFunction.mostrar_toast("Error del scan: " + err);
    });
  }

  start_sacanning() {
    this.barcodeScanner.scan().then((barcodeData) => {
      console.log("Datos del scan: ", barcodeData.text);
      AppGlobals.PRODUCT_LABEL = barcodeData.text;
      this.navCtrl.push( GeneralinfoPage );
    }, (err) => {
      console.error("Error: ", err);
      this.genericFunction.mostrar_toast("Error del scan: " + err);
    });
  }

  config() {
    this.navCtrl.push(ConfigPage);
  }

  register_directory() {
    this.navCtrl.push(RegisterdirectoryPage);
  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }



}
