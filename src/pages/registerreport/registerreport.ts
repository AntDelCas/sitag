import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppGlobals, LoginAsPage } from "../index.paginas";


@Component({
  selector: 'page-registerreport',
  templateUrl: 'registerreport.html',
})
export class RegisterreportPage {
  /** @description: Cabecera inicial de la aplicación: */
  texto_cabecera: string = AppGlobals.TEXTO_CABECERA;
  /** @description: Fecha en la que se escaneó el producto. */
  date_list : any = [];
  /** @description: Primer producto escaneado desde el último envío de reporte a la plataforma. */
  register_start : string;
  /** @description: Último producto escaneado desde el último envío de reporte a la plataforma. */
  register_ending : string;
  /** @description: Cantidad de productos registrados desde el último envío de reporte a la plataforma. */
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
