import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppGlobals, LoginAsPage } from "../index.paginas";
import { DatabaseProvider } from "../../providers/database/database";
import { GenericfunctionsProvider } from "../../providers/genericfunctions/genericfunctions";


@Component({
  selector: 'page-registersheet',
  templateUrl: 'registersheet.html',
})
export class RegistersheetPage {
  register_sheet : any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database:DatabaseProvider,
    public genericFunction: GenericfunctionsProvider)
  {
    for(let reg of AppGlobals.REGISTER_SHEET.registers)
      this.register_sheet.push(reg);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistersheetPage');
  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }

  backHome(){
    this.navCtrl.push ( LoginAsPage );
  }
}
