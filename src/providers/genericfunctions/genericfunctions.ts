import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ToastController, AlertController } from 'ionic-angular';
import { AppGlobals } from "../../pages/index.paginas";
import { DatabaseProvider } from "../database/database";
/*
  Generated class for the GenericfunctionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GenericfunctionsProvider {

  constructor(
    public http: HttpClient,
    public toastCtrl: ToastController,
    public database:DatabaseProvider,
    public alertCtrl: AlertController
  ){
    console.log('Hello GenericfunctionsProvider Provider');
  }

  /**
    * @name: mostrar_toast(mensaje : string)
    * @description: Muestra un mensaje al usuario.
    * @param: El mensaje que se mostrará al usuario.
    */
  mostrar_toast(mensaje: string) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  /**
    * @name: check_hasPermissions()
    * @description: Comprueba si el usuario tiene permisos en producto escaneado.
    * @return false - si no tiene permisos sobre el producto. true - si tiene permisos sobre el producto.
    */
  public check_hasPermissions(){
    for(let current_user of AppGlobals.USERS_LIST_LOCAL.users){
      if(current_user.user == AppGlobals.USER){
        for(let register of current_user.accesibility){
          if((register.register == AppGlobals.PRODUCT_LABEL) && (register.role == 'reg' || register.role == 'owner')){
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
    * @name: check_isOwner()
    * @description: Comprueba si el usuario es el propietario del producto escaneado.
    * @return false - si no es propietario. true - si es propietario.
    */
  public check_isOwner(){
    for(let current_user of AppGlobals.USERS_LIST_LOCAL.users){
      if(current_user.user == AppGlobals.USER){
        for(let register of current_user.accesibility){
          if(register.register == AppGlobals.PRODUCT_LABEL && register.role == 'owner'){
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
    * @name: getAccesibility()
    * @description: Carga en memoria la accesibilidad del usuario actual (permisos por cada producto)
    */
  public getAccesibility(){
    for(let user of AppGlobals.USERS_LIST_LOCAL.users){
      if(AppGlobals.USER == user.user)
        AppGlobals.USER_ACCESIBILITY = user.accesibility;
    }
  }

  /**
    * @name: check_isVisualizer(label : string)
    * @description: Comprueba si el usuario que está escaneando el producto tiene permisos de visualizado.
    * @return false - si no tiene permisos de visualizado. true - si tiene permisos de visualizado.
    */
  public check_isVisualizer(label : string){
    for(let current_label of AppGlobals.USER_ACCESIBILITY){
      if(current_label.register == label)
        return true;
    }
    return false;
  }

  /**
    * @name: alreadyRegistered()
    * @description: Comprueba si el producto que está siendo escaneado ha sido registrado anteriormente.
    * @return false - si no ha sido registrado. true - si ya ha sido registrado.
    */
  public alreadyRegistered(){
    console.log("alreadyRegistered");
    //Intenta cargar en memoria datos de la base de datos en local:
    this.database.getRegisterFromLocal(AppGlobals.USER);

    if(AppGlobals.REGISTER_SHEET === undefined || AppGlobals.REGISTER_SHEET.length == 0){
      return false;
    }else{
      for(let reg of AppGlobals.REGISTER_SHEET.registers)
        if(AppGlobals.PRODUCT_LABEL == reg.label)
          return true;
    }
    return false;
  }

  /**
    * @name: timeStamp()
    * @description: Devuelve la fecha y la hora actual.
    * @return: La hora y la fecha actual.
    */
  get timeStamp(){
    let myDate: string = new Date().getFullYear().toString() + "-" + new Date().getMonth().toString() + "-" + new Date().getDate().toString();
    let hour: string = new Date().getHours().toString() + ":" + new Date().getMinutes().toString() + ":" + new Date().getSeconds().toString();
    return myDate + " " + hour;
  }
}
