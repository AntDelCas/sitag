import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';
import { GenericfunctionsProvider } from '../../providers/genericfunctions/genericfunctions';

import { HomePage, LoginAsPage, CreateuserPage, IniVisualizerPage, AppGlobals } from "../index.paginas";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  /** @description: Cabecera inicial de la aplicación: */
  texto_cabecera: string = AppGlobals.TEXTO_CABECERA;
  /** @description: Usuario que será registrado en la aplicación. */
  username : string;
  /** @description: Contraseña del usuario que será registrado en la aplicación. */
  password: string;
  /** @description: Especifica si una validación de usuario es válida al contrastarla con los datos existentes en la aplicación. */
  isValidLogin: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public dataAccess: DataaccessProvider,
    public genericFunction: GenericfunctionsProvider) {
        //TODO: Datos de prueba para login: (borrar)
        console.log("LOCAL:")
        for (let entry of AppGlobals.USERS_LIST_LOCAL.users) {
          console.log("Usuario: " + entry.user + " Password: " + entry.password);
        }
        // console.log("SERVER:")
        // for (let entry of AppGlobals.USERS_LIST.users) {
        //   console.log("Usuario: " + entry.user + " Password: " + entry.password);
        // }
      ///////
  }

  /**
    * @name: login()
    * @description: Valida los datos de autentificación del usuario y guarda en memoria sus roles (owner, register o visualizer), que influirán en su navegación en la aplicación.
    */
  login(){
    //Itera los datos cargados en memoria:
    for (let entry of AppGlobals.USERS_LIST_LOCAL.users) {
      // Las credenciales son válidas:
      if((this.username == entry.user) && (this.password == entry.password)){
        AppGlobals.USER = entry.user;
        this.isValidLogin = true;

        //Carga en memoria la accesibilidad del usuario:
        this.genericFunction.getAccesibility();

        //Comprueba los permisos que tiene:
        if(entry.accesibility != ''){
          for (let permissions of entry.accesibility){
            if(permissions.role == "owner")
              AppGlobals.IS_OWNER = true;
            if(permissions.role == "reg")
              AppGlobals.IS_REGISTER = true;
            if(permissions.role == "vis")
              AppGlobals.IS_VISUALIZER = true;
          }
        }
      }
    }//for

    //Fallo en la validación:
    if(!this.isValidLogin){
    //Alerta del fallo de validación:
      let alert = this.alertCtrl.create({
        title: '¡Error!',
        subTitle: 'Usuario o contraseña incorrectos.',
        buttons: ['OK']
      });
      alert.present();
    }else{
      let getToken : any = {
        username: this.username,
        password: this.password
      }

      //Guarda el token del usuario validado:
      this.dataAccess.getTokenFromServer(getToken).then(data => {
        let token : any = data;
        console.log(token);
        AppGlobals.HEADER_TOKEN = token.token;

        //Si no tiene rol concreto redirige directamente a la página de visualizador:
        if(AppGlobals.IS_OWNER || AppGlobals.IS_REGISTER)
          this.navCtrl.push ( LoginAsPage );
        else
          this.navCtrl.push ( IniVisualizerPage );
      });
    }
  }

  /**
    * @name: lastSynchro()
    * @description: Devuelve el timeStamp de la última sincronización de usuarios.
    * @return: timeStamp de la última sincronización de usuarios.
    */
  get lastSynchro(){
    return AppGlobals.LAST_SYNCHRO;
  }

  /**
    * @name: createaccount()
    * @description: Navega hacia la interfaz de creación de usuario.
    */
  createaccount(){
    this.navCtrl.push ( CreateuserPage );
  }

  /**
    * @name: nav_home()
    * @description: Navega hacia la interfaz de home.
    */
  nav_home(){
    this.navCtrl.push ( HomePage );
  }
}
