import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppGlobals, LoginAsPage } from "../index.paginas";


@Component({
  selector: 'page-registerreport',
  templateUrl: 'registerreport.html',
})
export class RegisterreportPage {
  date_list : any = [];
  register_start : string;
  register_ending : string;
  countRegisters : string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
      //Carga en memoria el resumen de datos de los escaneos producidos en la aplicación.
      for(let reg of AppGlobals.REGISTER_SHEET.registers)
        this.date_list.push(reg.dateTime);
      this.register_start = this.date_list[0];
      this.register_ending = this.date_list[this.date_list.length - 1];
      this.countRegisters = AppGlobals.REGISTER_SHEET.countRegisters;
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterreportPage');
  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }

  backHome(){
    this.navCtrl.push ( LoginAsPage );
  }
}
