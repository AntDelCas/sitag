import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { ToastController } from 'ionic-angular';

import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';
import { DatabaseProvider } from '../../providers/database/database';

import { LoginPage, AppGlobals } from "../index.paginas";
import { GenericfunctionsProvider } from "../../providers/genericfunctions/genericfunctions";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  /** @description: Cabecera inicial de la aplicación: */
  texto_cabecera: string = AppGlobals.TEXTO_CABECERA;

  /** @description: Especifica si todo el contenido necesario está cargado. */
  everything_loaded : boolean = false;

  constructor(
    public navCtrl: NavController,
    public network: Network,
    public platform: Platform,
    public dataAccess: DataaccessProvider,
    private loadingCtrl:LoadingController,
    public alertCtrl: AlertController,
    public toast: ToastController,
    public database:DatabaseProvider,
    public genericFunction: GenericfunctionsProvider
    )
  {
      //Comprueba si tiene acceso a la red:
      if(navigator.onLine){
        AppGlobals.NETWORK_AVAILABLE = true;

        let getToken : any = {
          username: "ailem",
          password: "ailem"
        }

        let loader = this.loadingCtrl.create({
          content: 'Loading data...'
        });

        loader.present().then(()=>{

          this.dataAccess.getTokenFromServer(getToken).then(data => {
            let token : any = data;
            AppGlobals.HEADER_TOKEN = token.token;

            //Llama al provider que descarga el JSON del servidor y los carga en memoria:
            dataAccess.getUsersFromServer().then(data => {
              AppGlobals.USERS_LIST = data;
            }, (err) => {
              //Lanza un error para que se propague por la cadena de promises:
              throw new Error(err.message);
            }).then(data => {

              //Comprueba si hay coincidencias entre los datos descargados del servidor y los guardados en local (si existen):
              database.getUsersFromLocal().then(data => {
                let user_updated: boolean = false;

                if(data){
                  //<Sincronización de datos existentes en ambos puntos>
                  for (let local_user of AppGlobals.USERS_LIST_LOCAL.users) {
                    for (let server_user of AppGlobals.USERS_LIST.users) {
                      if(local_user.user == server_user.user){
                        let user_list_date = new Date(server_user.lastUpdate);
                        let user_list_local_date = new Date(local_user.lastUpdate);
                        //TODO: revisar correcto funcionamiento de la fecha (días > 12):
                        //Comprueba cual fecha es menor:
                        //if (la fecha del servidor es más actual) else (la fecha de los datos locales son más recientes)
                        if(user_list_date > user_list_local_date){
                          user_updated = true;
                          //Actualiza los datos locales:
                          local_user.user = server_user.user;
                          local_user.email = server_user.email;
                          local_user.password = server_user.password;
                          local_user.lastUpdate = server_user.lastUpdate;

                          //Unifica los items escaneados y sus permisos:
                          local_user.accesibility = this.mergeAccesibility(local_user.accesibility, server_user.accesibility);

                        }else{
                          if(user_list_date.getMilliseconds() != user_list_local_date.getMilliseconds()){
                            user_updated = true;
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

                  //Si se ha actualizado la accesibilidad:
                  if(user_updated)
                    this.addUser(AppGlobals.USERS_LIST_LOCAL);
                  //Actualiza la hora de última sincronización:
                  AppGlobals.LAST_SYNCHRO = this.genericFunction.timeStamp;
                }else{
                  //Si no existen datos en local pero si en la nube, los guarda en local y los carga en memoria:
                  this.addUser(AppGlobals.USERS_LIST);
                  AppGlobals.USERS_LIST_LOCAL = AppGlobals.USERS_LIST;
                  //Actualiza la hora de última sincronización:
                  AppGlobals.LAST_SYNCHRO = this.genericFunction.timeStamp;
                }
                //</Sincronización de datos existentes en ambos puntos>

                //Sincronización de usuarios NO existentes en ambos puntos:
                this.usersUnion(AppGlobals.USERS_LIST_LOCAL.users, AppGlobals.USERS_LIST.users);
              });

            //Si no existe el modelo por defecto del esquema lo carga en memoria y guarda en local:
            }, (err) => {
              //Lanza un error para que se propague por la cadena de promises:
              throw new Error(err.message);
            }).then(data =>{
              database.getSchemaFromLocal().then(data => {
                if(!data){
                  dataAccess.getAllSchemas().then(data => {
                    //TODO: seleccionar default schema
                    // AppGlobals.DEFAULT_SCHEMA = data;
                    // this.addSchemaToLocal(data);
                  });
                }
              });
              loader.dismiss();
              this.everything_loaded = true;
            }, (err) => {
              loader.dismiss();
              this.genericFunction.mostrar_toast("Error de acceso a base de datos: " + err.message);
            });
          }, (err) => {
            loader.dismiss();
            this.genericFunction.mostrar_toast("Error recuperando el token: " + err.message);
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
        }).then(data => {
          //Carga los datos del esquema guardados en local en memoria:
          database.getSchemaFromLocal().then(data => {});
          this.everything_loaded = true;
        });
      }

      //Registra un cambio en la disponibilidad de la red y lo notifica:
      platform.ready().then(() => {
        this.network.onchange().subscribe(data => {
          dataAccess.displayNetworkUpdate(data.type);
        }, error => console.error(error));
     });
  }

  /**
    * @name: usersUnion(local:any, server:any)
    * @description: Recibe la lista de usuarios guardados en local y la de los usuarios guardados en la plataforma. Compara las dos listas y añade los usuarios no comunes
    * a ambas listas para igualarlas.
    * @param: local - lista de usuarios locales. server - lista de usuarios descargados del servidor.
    */
  public usersUnion(local:any, server:any){
    let not_common:boolean = true,
    something_changed_server = false,
    something_changed_local = false;

    console.log("UsersUnion");

    //Comprueba si hay usuarios en local que no existan en la plataforma y los guarda en la lista en memoria de usuarios del servidor.
    for(let local_user of local){
      not_common = true;

      for(let server_user of server){
          if(local_user.user == server_user.user)
            not_common = false;
      }

      //Si el usuario no existe en el servidor, lo añade a la lista en memoria.
      if(not_common){
        something_changed_server = true;
        //Actualiza el recuento de usuarios:
        let countUsers : number = AppGlobals.USERS_LIST.countUsers;
        countUsers++;
        AppGlobals.USERS_LIST.countUsers = countUsers.toString();

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

    //Comprueba si hay usuarios en el servidor que no existan en local y los guarda en la lista en memoria de usuarios.
    for(let server_user of server){
      not_common = true;

      for(let local_user of local){
        if(local_user.user == server_user.user)
          not_common = false;
      }

      //Si el usuario no existe en local, lo añade a la lista en memoria.
      if(not_common){
        something_changed_local = true;
        //Actualiza el recuento de usuarios:
        let countUsers : number = AppGlobals.USERS_LIST_LOCAL.countUsers;
        countUsers++;
        AppGlobals.USERS_LIST_LOCAL.countUsers = countUsers.toString();

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

    console.log("User list local: ");
    console.log(AppGlobals.USERS_LIST_LOCAL);

    console.log("something_changed_server " + something_changed_server);
    console.log("something_changed_local " + something_changed_local);

    //Comprueba si hay cambios en local o en el servidor y guarda en el punto que sea necesario.
    if(something_changed_local)
      this.addUser(AppGlobals.USERS_LIST_LOCAL);
    if(something_changed_server)
      console.log("Hay un usuario local que no está en servidor");
      //TODO: añadir actualizar servidor
  }

  /**
    * @name: mergeAccesibility(local_accesibility : any, server_accesibility : any)
    * @description: Recibe la accesbilidad (permisos) de los usuarios locales y los usuarios en la plataforma y une en una sola lista de accesibilidad.
    * @param: local_accesibility - lista de permisos sobre los productos de un usuario local. server_accesibility - lista de permisos sobre los productos de un usuario en la nube.
    * @return: una lista de toda la accesibilidad de un usuario (local + servidor).
    */
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


  /**
    * @name: addUser(user_list:any)
    * @description: Guarda la lista de usuarios cargados en memoria en la base de datos en local. Formatea los datos y hace una llamada al provider que gestiona la base de datos.
    * Notifica al usuario si la actualización ha sido completada.
    * @param: La lista de usuarios actualizada que está guardada en memoria.
    */
  public addUser(user_list:any){
    let loader = this.loadingCtrl.create();
    loader.present().then(()=>{
      let userList : string = JSON.stringify(user_list);
      this.database.addUserToLocal(AppGlobals.LAST_SYNCHRO, userList).then((list)=>{
        this.genericFunction.mostrar_toast('Actualización de datos completada.');
      });
      loader.dismiss();
    });
  }

  /**
    * @name: addSchemaToLocal(donwloaded_schema:any)
    * @description: Guarda en local el esquema predeterminado de la aplicación para el visionado de productos.
    * @param: El esquema predeterminado de la aplicación.
    */
  public addSchemaToLocal(donwloaded_schema:any){
    let loader = this.loadingCtrl.create();
    loader.present().then(()=>{
      let schema : string = JSON.stringify(donwloaded_schema);
      this.database.addSchemaToLocal(schema).then((list)=>{
        this.genericFunction.mostrar_toast('Esquema predeterminado descargado.');
      });
      loader.dismiss();
    });
  }

  /**
    * @name: check_everythingLoaded()
    * @description: Comprueba si todos los procesos de home han sido completados y está toda la información necesaria para arrancar la aplicación disponible.
    * @return: false - si todo ha sido cargado correctamente. true - si aún quedan datos por cargar
    */
  get check_everythingLoaded(){
    if(this.everything_loaded)
      return false;
    else return true;
  }

  // TODO: Función de pruebas (borrar:)
  public deleteTable(){
    this.database.deleteUser();
    this.database.deleteRegister();
    AppGlobals.USERS_LIST_LOCAL = '';
  }
}
