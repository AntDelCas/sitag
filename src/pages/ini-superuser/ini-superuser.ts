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
  /** @description: Cabecera inicial de la aplicación: */
  texto_cabecera: string = AppGlobals.TEXTO_CABECERA;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    public alertCtrl: AlertController,
    public genericFunction: GenericfunctionsProvider,
    public dataAccess: DataaccessProvider) {
  }

  /**
    * @name: download_schemas()
    * @description: Descarga la lista de esquemas de producto del servidor.
    */
  download_schemas() {
    this.dataAccess.getAllSchemas().then(data =>{
      AppGlobals.SCHEMA_LIST = data;
      this.genericFunction.mostrar_toast('Lista de esquemas descargados.');
      console.log(AppGlobals.SCHEMA_LIST);
    });
  }

  /**
    * @name: customize()
    * @description: Escanea un código QR, comprueba si el usuario escaneando tiene permisos para personalizar ese producto. Guarda la etiqueta escaneada en la variable
    * AppGlobals.PRODUCT_LABEL
    */
  customize() {
    this.barcodeScanner.scan().then((barcodeData) => {
      AppGlobals.PRODUCT_LABEL = barcodeData.text;

      //Comprueba si tiene permisos para registrar el producto que se ha escaneado:
      if(this.genericFunction.check_isOwner())
        this.navCtrl.push(CustomizePage);
      else{
        let alert = this.alertCtrl.create({
          title: '¡Error!',
          subTitle: 'No tienes permisos para modificar este producto.',
          buttons: ['OK']
        });
        alert.present();
      }
    });

  }

  /**
    * @name: start_register()
    * @description: Escanea un código QR, comprueba si el usuario escaneando tiene permisos para registrar/visualizar ese producto. Guarda la etiqueta escaneada en la variable
    * AppGlobals.PRODUCT_LABEL
    */
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

  /**
    * @name: start_scanning()
    * @description: Escanea un código QR, comprueba si el usuario escaneando tiene permisos para visualizar ese producto. Guarda la etiqueta escaneada en la variable
    * AppGlobals.PRODUCT_LABEL
    */
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
      this.genericFunction.mostrar_toast("Error del scan: " + err);
    });
  }

  /**
    * @name: config()
    * @description: Navega hacia la interfaz de configuración.
    */
  config() {
    this.navCtrl.push(ConfigPage);
  }

  /**
    * @name: register_directory()
    * @description: Navega hacia la interfaz de directorio de registro.
    */
  register_directory() {
    this.navCtrl.push(RegisterdirectoryPage);
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
