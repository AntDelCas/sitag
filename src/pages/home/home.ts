import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { ToastController } from 'ionic-angular';

import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';
import { DatabaseProvider } from '../../providers/database/database';

import { LoginPage, AppGlobals } from "../index.paginas";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  texto_cabecera: string = AppGlobals.TEXTO_CABECERA;

  constructor(
    public navCtrl: NavController,
    public network: Network,
    public platform: Platform,
    public dataAccess: DataaccessProvider,
    private loadingCtrl:LoadingController,
    public alertCtrl: AlertController,
    public toast: ToastController,
    public database:DatabaseProvider
    )
  {
      //Comprueba si tiene acceso a la red:
      if(navigator.onLine){
        AppGlobals.NETWORK_AVAILABLE = true;

        //Llama al provider que descarga el JSON del servidor y los carga en memoria:
        dataAccess.getUsers().then(data => {
          AppGlobals.USERS_LIST = data;
        });

        //TODO: Aqui se debe comparar los datos en local con los descargados desde el servidor

        let local_instance : boolean = false;

        //Comprueba si hay coincidencias entre los datos descargados del servidor y los guardados en local (si existen):
        database.getUsersJSON().then(data => {
          if(data){
            for (let local_user of AppGlobals.USERS_LIST_LOCAL.users) {
              for (let server_user of AppGlobals.USERS_LIST.users) {
                if(local_user.user == server_user.user){
                    local_instance = true;
                    let user_list_date = new Date(server_user.lastUpdate);
                    let user_list_local_date = new Date(local_user.lastUpdate);

                    //TODO: Comparar fecha más antigua y actualizar el usuario

                    // console.log(user_list_date);
                    // console.log(user_list_local_date);
                }
              }
            }

            //Actualiza la hora de última sincronización:
            AppGlobals.LAST_SYNCHRO = this.dataAccess.timeStamp;

          }else{
            let loader = this.loadingCtrl.create();
            loader.present().then(()=>{
              let userList : string = JSON.stringify(AppGlobals.USERS_LIST);

              this.database.addUser(AppGlobals.LAST_SYNCHRO, userList).then((list)=>{
                this.toast.create({
                  message: `Descarga de datos completada.`,
                  duration: 3000
                }).present();
              });
              loader.dismiss();
            });
          }
          console.log(local_instance);
        });
      }else{
        //Utiliza los datos guardados en local (si existen):
        AppGlobals.NETWORK_AVAILABLE = false;
      }

      //Registra un cambio en la disponibilidad de la red y lo notifica:
      platform.ready().then(() => {
        this.network.onchange().subscribe(data => {
          dataAccess.displayNetworkUpdate(data.type);
        }, error => console.error(error));
     });
  }

  nav_login(){
    this.navCtrl.push ( LoginPage );
  }

  public addUser(){
    let loader = this.loadingCtrl.create();
    loader.present().then(()=>{
      let userList : string = JSON.stringify(AppGlobals.USERS_LIST);
      this.database.addUser(AppGlobals.LAST_SYNCHRO, userList).then((list)=>{
      });
      loader.dismiss();
    });
  }

  //Función de pruebas (borrar):
  public deleteTable(){
    this.database.deleteUser();
  }
}
