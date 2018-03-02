import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';

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
    public dataAccess: DataaccessProvider
    )
  {
      //Comprueba si tiene acceso a la red:
      if(navigator.onLine){
        //Descarga JSON del servidor:
        AppGlobals.NETWORK_AVAILABLE = true;
        this.getUsers();
      }else{
        //Utiliza los datos guardados en local (si existen):
        AppGlobals.NETWORK_AVAILABLE = false;
      }

      //Registra un cambio en la disponibilidad de la red:
      platform.ready().then(() => {
        this.network.onchange().subscribe(x => console.log(x));
        // this.network.onConnect().subscribe(x => console.log(x));
        // this.network.onDisconnect().subscribe(x => console.log(x));
       });
  }

  //Llama al provider que gestiona al JSON del backend y guarda los datos en una variable global:
  getUsers() {
    this.dataAccess.getUsers()
    .then(data => {
      AppGlobals.USERS_LIST = data;
    });
  }


  nav_login(){
    this.navCtrl.push ( LoginPage );
  }

}
