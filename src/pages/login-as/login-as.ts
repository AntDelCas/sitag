import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database';

import { IniVisualizerPage, IniRegisterPage, IniSuperuserPage, AppGlobals, LoginPage } from "../index.paginas";


@Component({
  selector: 'page-login-as',
  templateUrl: 'login-as.html',
})
export class LoginAsPage {
  /** @description: Cabecera inicial de la aplicación: */
  texto_cabecera: string = AppGlobals.TEXTO_CABECERA;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database:DatabaseProvider) {
  }

  /**
    * @name: nav_visualizer()
    * @description: Navega hacia la interfaz de visualizador.
    */
  nav_visualizer(){
    this.navCtrl.push ( IniVisualizerPage );
  }

  /**
    * @name: nav_register()
    * @description: Navega hacia la interfaz de registrador.
    */
  nav_register(){
    this.database.getRegisterFromLocal(AppGlobals.USER).then(data => {
      this.navCtrl.push ( IniRegisterPage );
    });
  }

  /**
    * @name: nav_superuser()
    * @description: Navega hacia la interfaz de super usuario.
    */
  nav_superuser(){
    this.database.getRegisterFromLocal(AppGlobals.USER).then(data => {
      this.navCtrl.push ( IniSuperuserPage );
    });
  }

  /**
    * @name: register_directory()
    * @description: Borra los datos en memoria generados por el usuario y lo desconecta de la aplicación. Navega hacia la interfaz de login..
    */
  logOff(){
    this.resetVariables();
    this.navCtrl.push ( LoginPage );
  }


  /**
    * @name: resetVariables()
    * @description: Reinicia las variables para hacer un log-off de la aplicación correcto.
    */
  resetVariables(){
    AppGlobals.IS_OWNER = false;
    AppGlobals.IS_REGISTER = false;
    AppGlobals.IS_VISUALIZER = false;
    AppGlobals.PRODUCT_LABEL = '';
    AppGlobals.REGISTER_SHEET = [];
  }

  /**
    * @name: getUsername()
    * @description: Devuelve el nick del usuario que está validado en la aplicación.
    */
  get getUsername() {
   return AppGlobals.USER;
  }

  /**
    * @name: isOwner()
    * @description: Comprueba si el usuario tiene el rol de Owner
    * @return: false - si es owner. true - si NO es owner.
    */
  get isOwner(){
    if(AppGlobals.IS_OWNER)
      return false;
    else return true;
  }

  /**
    * @name: isRegister()
    * @description: Comprueba si el usuario tiene el rol de Owner
    * @return: false - si es register. true - si NO es register.
    */
  get isRegister(){
    if(AppGlobals.IS_REGISTER)
      return false;
    else return true;
  }

  /**
    * @name: isVisualizer()
    * @description: Comprueba si el usuario tiene el rol de Owner
    * @return: false - si es visualizer. true - si NO es visualizer.
    */
  get isVisualizer(){
    if(AppGlobals.IS_VISUALIZER)
      return false;
    else return true;
  }
}
