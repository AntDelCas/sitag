import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';

import { HomePage, LoginAsPage, CreateuserPage, IniVisualizerPage, AppGlobals } from "../index.paginas";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username : string;
  password: string;
  indexOfUser : number = 0;
  isValidLogin: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public dataAccess: DataaccessProvider) {
      //Datos de prueba para login: (borrar)
      for (let entry of AppGlobals.USERS_LIST_LOCAL.users) {
        console.log("Usuario: " + entry.user + " Password: " + entry.password);
      }
  }

  //Comprueba si el login es válido:
  login(){
    //Itera los datos cargados en memoria:
    for (let entry of AppGlobals.USERS_LIST.users) {
      // Las credenciales son válidas:
      if((this.username == entry.user) && (this.password == entry.password)){
        AppGlobals.USER = entry.user;
        this.isValidLogin = true;

        //Comprueba los permisos que tiene:
        for (let permissions of entry.accesibility){
          if(permissions.role == "owner")
            AppGlobals.IS_OWNER = true;
          if(permissions.role == "reg")
            AppGlobals.IS_REGISTER = true;
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
      //Si no tiene rol concreto redirige directamente a la página de visualizador:
      if(AppGlobals.IS_OWNER || AppGlobals.IS_REGISTER)
        this.navCtrl.push ( LoginAsPage );
      else
        this.navCtrl.push ( IniVisualizerPage );
    }
  }

  //Devuelve el timeStamp de la última sincronización de usuarios:
  get lastSynchro(){
    return AppGlobals.LAST_SYNCHRO;
  }

  createaccount(){
    this.navCtrl.push ( CreateuserPage );
  }

  nav_home(){
    this.navCtrl.push ( HomePage );
  }
}
