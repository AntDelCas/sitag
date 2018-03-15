import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { RegistersheetPage, RegisterreportPage, AppGlobals } from "../index.paginas";

import { DatabaseProvider } from "../../providers/database/database";
import { DataaccessProvider } from "../../providers/dataaccess/dataaccess";

@Component({
  selector: 'page-registerdirectory',
  templateUrl: 'registerdirectory.html',
})

export class RegisterdirectoryPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database:DatabaseProvider,
    public dataAccess: DataaccessProvider,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterdirectoryPage');
  }


  open_register_sheet() {
    this.navCtrl.push( RegistersheetPage );
  }

  send_register_sheet() {
    this.database.getRegisterFromLocal(AppGlobals.USER).then(()=>{
      if(AppGlobals.REGISTER_SHEET === undefined || AppGlobals.REGISTER_SHEET.length == 0){
        let alert = this.alertCtrl.create({
          title: 'Aviso',
          subTitle: 'No existe ningún registro que enviar.',
          buttons: ['OK']
        });
        alert.present();
      }else{
        //TODO: habilitar este método cuando esté el backend final.
        //this.dataAccess.addRegisterToServer(AppGlobals.REGISTER_SHEET).then(data => {
          //Limpia los registros de la base de datos:
          AppGlobals.REGISTER_SHEET = [];
          this.database.deleteRegister();
        //});
      }
    });
  }

  open_register_report() {
    this.navCtrl.push( RegisterreportPage );
  }

  send_register_report() {

  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }


}
