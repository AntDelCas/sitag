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
  /** @description: Cabecera inicial de la aplicación: */
  texto_cabecera: string = AppGlobals.TEXTO_CABECERA;
  /** @description: Lista de datos de los productos escaneados. */
  register_sheet : any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database:DatabaseProvider,
    public genericFunction: GenericfunctionsProvider)
  {
    //Carga en memoria los datos de los productos escaneados.
    for(let reg of AppGlobals.REGISTER_SHEET.registers)
      this.register_sheet.push(reg);
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
