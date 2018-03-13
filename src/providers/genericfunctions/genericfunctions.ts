import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ToastController } from 'ionic-angular';
import { AppGlobals } from "../../pages/index.paginas";
/*
  Generated class for the GenericfunctionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GenericfunctionsProvider {

  constructor(
    public http: HttpClient,
    public toastCtrl: ToastController
  ){
    console.log('Hello GenericfunctionsProvider Provider');
  }

  //mostrar ToastController
  mostrar_toast(mensaje: string) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  //Comprueba si el usuario tiene permisos para el producto escaneado:
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

}
