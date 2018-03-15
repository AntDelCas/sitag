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
  getUsersFromServer() {
  return new Promise(resolve => {
    this.http.get(this.apiUrl+'5aa263472f0000ae17d4656d').subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
  }

  //Carga esquema para el control de elementos
  getSchema(identifier : string) {
  return new Promise(resolve => {
    this.http.get(this.apiUrl+'5a9fa3402e0000100074d123').subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
  }

  //Carga los datos del producto:
  getProductInfo(label : string){
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'5a9d3e82310000dc1dab5327').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  //Añade los datos de usuario al servidor:
  addUserToServer(data) {
  return new Promise((resolve, reject) => {
    this.http.post(this.apiUrl+'users', JSON.stringify(data))
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
  }

  //Añade los datos del registro al servidor:
  addRegisterToServer(data) {
  return new Promise((resolve, reject) => {
    this.http.post(this.apiUrl+'register', JSON.stringify(data))
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
