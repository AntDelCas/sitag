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
        AppGlobals.NETWORK_AVAILABLE = true;

        //Llama al provider que descarga el JSON del servidor y los carga en memoria:
        dataAccess.getUsers().then(data => {
          AppGlobals.USERS_LIST = data;
          AppGlobals.LAST_SYNCHRO = this.dataAccess.timeStamp;
        });
        
        //TODO: Aqui se debe comparar los datos en local con los descargados desde el servidor
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

}
