import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppGlobals } from "../../pages/index.paginas";
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

/*
  Generated class for the DataaccessProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataaccessProvider {

  //Link del backend:
  apiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(
    public http: HttpClient,
    public toast: ToastController,
    public network: Network
  ) {
    console.log('Hello DataaccessProvider Provider');
  }

  //Carga en memoria los datos del JSON descargado:
  getUsers() {
  return new Promise(resolve => {
    this.http.get(this.apiUrl+'/users').subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
  }

  //Notifica los cambios en la disponibilidad de la red:
  displayNetworkUpdate(connectionState: string){
    //Actualiza la variable global
    if(connectionState == 'online')
      AppGlobals.NETWORK_AVAILABLE = true;
    else
      AppGlobals.NETWORK_AVAILABLE = false;

    this.toast.create({
      message: `Ahora estás ${connectionState}.`,
      duration: 3000
    }).present();
  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }
}
