import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  apiUrl= 'http://www.mocky.io/v2/';
  /** @param: Link del backend */
  url = 'https://sitag.bettergy.es/api/';
  constructor(
    public http: HttpClient,
    public toast: ToastController,
    public network: Network
  ) {
  }

  /**
    * @name: getTokenFromServer(data)
    * @description: Se lanza al servidor unos datos de login por defecto y se rescupera el token requerido para la autorización en el sistema.
    * @param: Datos del login por defecto que se utilizan para recibir el token.
    */
  getTokenFromServer(data) {
  return new Promise((resolve, reject) => {
    this.http.post(this.url+'login/', data)//, options)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  /**
    * @name: getUsersFromServer()
    * @description: Descarga la lista de usuarios dados de alta en la aplicación y la guarda en memoria.
    */
  getUsersFromServer() {
  return new Promise((resolve, reject) => {
    this.http.get(this.apiUrl+'5ac5e3384a000011007e0513').subscribe(data => {
      resolve(data);
    }, err => {
      reject(err);
    });
  });
  }

  //Carga en memoria los datos del JSON descargado:
  // getUsersFromServer() {
  // console.log("getUsersFromServer()");
  // console.log(AppGlobals.HEADER_TOKEN);
  //
  // const headers = new HttpHeaders({ 'Authorization' : 'Token ' + AppGlobals.HEADER_TOKEN });
  // // const headers = httpHeaders.append("Authorization", AppGlobals.HEADER_TOKEN);
  //
  // return new Promise(resolve => {
  //   this.http.get(this.url+'users/', { headers : headers }).subscribe(data => {
  //     resolve(data);
  //   }, err => {
  //     console.log(err);
  //   });
  // });
  // }

  //Carga esquema para el control de elementos
  // DEPRECATED
  // getSchema(identifier : string) {
  //
  // return new Promise(resolve => {
  //   this.http.get(this.url+'5a9fa3402e0000100074d123').subscribe(data => {
  //     resolve(data);
  //   }, err => {
  //     console.log(err);
  //   });
  // });
  // }

  /**
    * @name: getAllSchemas()
    * @description: Descarga la lista de esquemas de la plataforma y los guarda en memoria.
    */
  getAllSchemas(){
  console.log("getAllSchemas()");

  const headers = new HttpHeaders({ 'Authorization' : 'Token ' + AppGlobals.HEADER_TOKEN });
    return new Promise((resolve, reject) => {
      this.http.get(this.url+'schema/', { headers : headers }).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  /**
    * @name: getProductInfo(label : string)
    * @description: Descarga la información disponible del producto escaneado.
    * @param: La etiqueta identificadora del producto.
    */

    getProductInfo(label : string){
      const headers = new HttpHeaders({ 'Authorization' : 'Token ' + AppGlobals.HEADER_TOKEN });
      return new Promise((resolve, reject) => {
        this.http.get(this.url + "registers/" + label, { headers : headers }).subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
      });
    }

  // 5ab8adac2c00004b001860cc
  // getProductInfo(label : string){
  //   return new Promise(resolve => {
  //     this.http.get(this.apiUrl+'5ac60c234a00005b007e05f8').subscribe(data => {
  //       resolve(data);
  //     }, err => {
  //       console.log(err);
  //     });
  //   });
  // }

  /**
    * @name: addUserToServer(data)
    * @description: Añade un nuevo registro de usuario a la plataforma.
    * @param: Datos de registro de usuario.
    */
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

  /**
    * @name: addRegisterToServer(data)
    * @description: Añade un nuevo registro de producto a la plataforma.
    * @param: Datos de registro de producto.
    */
  addRegisterToServer(data) {
    console.log("addRegisterToServer()");

    const headers = new HttpHeaders({ 'Authorization' : 'Token ' + AppGlobals.HEADER_TOKEN });
      return new Promise((resolve, reject) => {
        this.http.post(this.url+'registers/', data, { headers : headers }).subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
      });
  }

  /**
    * @name: addRegisterReportToServer(data)
    * @description: Añade un nuevo report de registro a la plataforma.
    * @param: Datos del report de registro.
    */
  addRegisterReportToServer(data) {
  return new Promise((resolve, reject) => {
    this.http.post(this.apiUrl+'report', JSON.stringify(data))
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
  }

  /**
    * @name: displayNetworkUpdate(connectionState : string)
    * @description: Notifica al usuario un cambio en el estado de la conexión a internet.
    * @param: El estado de la conexión (online/offline)
    */
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
