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
        dataAccess.getUsersFromServer().then(data => {
          AppGlobals.USERS_LIST = data;
        }).then(data => {

          //Comprueba si hay coincidencias entre los datos descargados del servidor y los guardados en local (si existen):
          database.getUsersFromLocal().then(data => {
            if(data){

              //<Sincronización de datos existentes en ambos puntos>
              for (let local_user of AppGlobals.USERS_LIST_LOCAL.users) {
                for (let server_user of AppGlobals.USERS_LIST.users) {
                  if(local_user.user == server_user.user){
                    let user_list_date = new Date(server_user.lastUpdate);
                    let user_list_local_date = new Date(local_user.lastUpdate);

                    //Comprueba cual fecha es menor:
                    //if (la fecha del servidor es más actual) else (la fecha de los datos locales son más recientes)
                    if(user_list_date > user_list_local_date){
                      //Actualiza los datos locales:
                      local_user.user = server_user.user;
                      local_user.email = server_user.email;
                      local_user.password = server_user.password;
                      local_user.lastUpdate = server_user.lastUpdate;

                      //Unifica los items escaneados y sus permisos:
                      local_user.accesibility = this.mergeAccesibility(local_user.accesibility, server_user.accesibility);
                      this.addUser(AppGlobals.USERS_LIST_LOCAL);
                    }else{
                      if(user_list_date.getMilliseconds() != user_list_local_date.getMilliseconds()){
                        server_user.user = local_user.user;
                        server_user.email = local_user.email
                        server_user.password = local_user.password;;
                        server_user.lastUpdate = local_user.lastUpdate;

                        //Unifica los items escaneados y sus permisos:
                        server_user.accesibility = this.mergeAccesibility(local_user.accesibility, server_user.accesibility);

                        //TODO: Actualizar usuario en el servidor
                      }
                    }
                  }
                }
              }
              //Actualiza la hora de última sincronización:
              AppGlobals.LAST_SYNCHRO = this.dataAccess.timeStamp;
            }else{
              //Si no existen datos en local pero si en la nube, los guarda en local y los carga en memoria:
              this.addUser(AppGlobals.USERS_LIST);
              AppGlobals.USERS_LIST_LOCAL = AppGlobals.USERS_LIST;
              //Actualiza la hora de última sincronización:
              AppGlobals.LAST_SYNCHRO = this.dataAccess.timeStamp;
            }
            //</Sincronización de datos existentes en ambos puntos>

            //Sincronización de usuarios NO existentes en ambos puntos:
            this.usersUnion(AppGlobals.USERS_LIST_LOCAL.users, AppGlobals.USERS_LIST.users);
          });
        });
      }else{
        //Utiliza los datos guardados en local (si existen):
        AppGlobals.NETWORK_AVAILABLE = false;

        database.getUsersFromLocal().then(data => {
          if(!data){
            let alert = this.alertCtrl.create({
              title: 'Aviso',
              subTitle: 'No existen datos locales ni conexión a internet.',
              buttons: ['OK']
            });
            alert.present();
          }
        });
      }

      //Registra un cambio en la disponibilidad de la red y lo notifica:
      platform.ready().then(() => {
        this.network.onchange().subscribe(data => {
          dataAccess.displayNetworkUpdate(data.type);
        }, error => console.error(error));
     });
  }

  //Los usuarios que no existan en uno u otro punto, se guardan en ambos:
  public usersUnion(local:any, server:any){
    let not_common:boolean = true,
    something_changed_server = false,
    something_changed_local = false;

    console.log("UsersUnion");

    //Nuevos usuarios de local al servidor:
    for(let local_user of local){
      not_common = true;
      for(let server_user of server){
          if(local_user.user == server_user.user)
            not_common = false;
      }
      if(not_common){
        something_changed_server = true;
        AppGlobals.USERS_LIST.users.push(
          {
            user: local_user.user,
            email: local_user.email,
            password: local_user.password,
            lastUpdate: local_user.lastUpdate,
            accesibility: local_user.accesibility
          }
        );
      }
    }

    //Nuevos usuarios del servidor a local:
    for(let server_user of server){
    not_common = true;
      for(let local_user of local){
        if(local_user.user == server_user.user)
          not_common = false;
      }
      if(not_common){
        something_changed_local = true;
        AppGlobals.USERS_LIST_LOCAL.users.push(
          {
            user: server_user.user,
            email: server_user.email,
            password: server_user.password,
            lastUpdate: server_user.lastUpdate,
            accesibility: server_user.accesibility
          }
        );
      }
    }

    console.log("something_changed_server " + something_changed_server);
    console.log("something_changed_local " + something_changed_local);

    if(something_changed_local)
      this.addUser(AppGlobals.USERS_LIST_LOCAL);
    if(something_changed_server)
      console.log("Hay un usuario local que no está en servidor");
      //TODO: añadir actualizar servidor
  }

  //Une los elementos registrados para un usuario entre los datos de la nube y los locales:
  public mergeAccesibility(local_accesibility:any, server_accesibility:any){
    let merged_data:any = [];
    let index = 0;

    //Elimina los elementos comunes y une los no comunes en merged_data:
    for(let local_access of local_accesibility){
      index = 0;
      for(let server_access of server_accesibility){
        if((local_access.register == server_access.register) && (local_access.role == server_access.role))
          server_accesibility.splice(index,1);
        index++;
      }
    }
    merged_data = local_accesibility.concat(server_accesibility);
    return merged_data;
  }

  nav_login(){
    this.navCtrl.push ( LoginPage );
  }

  public addUser(user_list:any){
    let loader = this.loadingCtrl.create();
    loader.present().then(()=>{
      let userList : string = JSON.stringify(user_list);
      this.database.addUserToLocal(AppGlobals.LAST_SYNCHRO, userList).then((list)=>{
        this.toast.create({
          message: `Actualización de datos completada.`,
          duration: 3000
        }).present();
      });
      loader.dismiss();
    });
  }

  //Función de pruebas (borrar):
  public deleteTable(){
    this.database.deleteUser();
    AppGlobals.USERS_LIST_LOCAL = '';
  }
}
