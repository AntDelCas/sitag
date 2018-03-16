import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { GeneralinfoPage, RegisterdirectoryPage, CustomizePage, ConfigPage, RegisterPage, AppGlobals, LoginAsPage } from "../index.paginas";

import { GenericfunctionsProvider } from '../../providers/genericfunctions/genericfunctions';
//plugin
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DataaccessProvider } from "../../providers/dataaccess/dataaccess";

@Component({
  selector: 'page-ini-superuser',
  templateUrl: 'ini-superuser.html',
})
export class IniSuperuserPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    public alertCtrl: AlertController,
    public genericFunction: GenericfunctionsProvider,
    public dataAccess: DataaccessProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IniSuperuserPage');
  }

  download_schemas() {
    this.dataAccess.getAllSchemas().then(data =>{
      AppGlobals.SCHEMA_LIST = data;
      this.genericFunction.mostrar_toast('Lista de esquemas descargados.');
      console.log(AppGlobals.SCHEMA_LIST);
    });
  }

  customize() {
    this.barcodeScanner.scan().then((barcodeData) => {
      AppGlobals.PRODUCT_LABEL = barcodeData.text;

      //Comprueba si tiene permisos para registrar el producto que se ha escaneado:
      if(this.genericFunction.check_isOwner())
        this.navCtrl.push(CustomizePage);
      else{
        let alert = this.alertCtrl.create({
          title: '¡Error!',
          subTitle: 'No tienes permisos para visualizar este producto.',
          buttons: ['OK']
        });
        alert.present();
      }
    });

  }

  start_register() {
    this.barcodeScanner.scan().then((barcodeData) => {
      AppGlobals.PRODUCT_LABEL = barcodeData.text;

      //Comprueba si tiene permisos para registrar el producto que se ha escaneado:
      if(this.genericFunction.check_hasPermissions())
        if(this.genericFunction.alreadyRegistered()){
          let alert = this.alertCtrl.create({
            title: '¡Error!',
            subTitle: 'Ese producto ya ha sido registrado.',
            buttons: ['OK']
          });
          alert.present();
        }else
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

  backHome(){
    this.navCtrl.push ( LoginAsPage );
  }

}
