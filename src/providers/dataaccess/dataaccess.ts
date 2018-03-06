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
  data: any = null;
  //Link del backend:
  apiUrl= 'http://www.mocky.io/v2/';

  constructor(
    public http: HttpClient,
    public toast: ToastController,
    public network: Network
  ) {
  }

  //Carga en memoria los datos del JSON descargado:
  getUsers() {
  return new Promise(resolve => {
    this.http.get(this.apiUrl+'5a9d24393100005700ab5277').subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
  }

  //Carga esquema para el control de elementos
  getSchema() {
  return new Promise(resolve => {
    this.http.get(this.apiUrl+'5a9e7c333000004e00234c77').subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
  }

  //Carga los datos del producto:
  getGeneralInfo(){
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'5a9d3e82310000dc1dab5327').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  addUser(data) {
  return new Promise((resolve, reject) => {
    this.http.post(this.apiUrl+'/users', JSON.stringify(data))
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
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

  //Devuelve la fecha y la hora actual:
  get timeStamp(){
    let myDate: string = new Date().getDate().toString() +"-"+ new Date().getMonth().toString() +"-"+ new Date().getFullYear().toString();
    let hour: string = new Date().getHours().toString() +":"+new Date().getMinutes().toString() + ":" + new Date().getSeconds().toString();
    return myDate + " " + hour;
  }
}
