import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppGlobals } from "../index.paginas";
import { DatabaseProvider } from "../../providers/database/database";


@Component({
  selector: 'page-registersheet',
  templateUrl: 'registersheet.html',
})
export class RegistersheetPage {
  register_sheet : any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database:DatabaseProvider)
  {
    //Carga en memoria los datos de los productos registrados:
    this.database.getRegisterFromLocal(AppGlobals.USER).then(response => {
      if(!AppGlobals.REGISTER_SHEET === undefined && AppGlobals.REGISTER_SHEET.length != 0)
        for(let reg of AppGlobals.REGISTER_SHEET.registers)
          this.register_sheet.push(reg);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistersheetPage');
  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }
}
