import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppGlobals } from "../index.paginas";
import { ToastController } from 'ionic-angular';

import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';
import { DatabaseProvider } from '../../providers/database/database';

import { LoginPage } from "../index.paginas";
import { GenericfunctionsProvider } from "../../providers/genericfunctions/genericfunctions";

@Component({
  selector: 'page-createuser',
  templateUrl: 'createuser.html',
})

/**
  * @name: CreateuserPage
  * @description: Registra un nuevo usuario en la aplicación.
  */
export class CreateuserPage {
  myForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public dataAccess: DataaccessProvider,
    private loadingCtrl:LoadingController,
    public alertCtrl: AlertController,
    public toast: ToastController,
    public database:DatabaseProvider,
    public genericFunction: GenericfunctionsProvider
  ) {
    //Valida los campos del formulario:
    //Password mínimo 8 caracteres
      this.myForm = this.formBuilder.group({
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateuserPage');
  }

  /**
    * @name: register()
    * @description: Guarda los datos de registro introducidos por el usuario. Los datos se guardarán en local y se cargarán en el servidor en la siguiente sincronización
    * (inicio de la app).
    * Comprueba si hay conexión y datos de usuarios en local. Si hay conexión y no datos locales, los intenta descargar y añade el nuevo registro a esta lista. Si no hubiera
    * conectividad ni datos cargados en local, el usuario se generaría igualmente y se sincronizaría con la plataforma en el siguiente inicio de la app. Hasta que no se realizase
    * una sincronización de los datos, los nuevos usuarios no tendrían ningún rol (owner, register o visualizer), por lo que solo podrían escanear las etiquetas y se les mostrará
    * un string con el escaneo sin ningún otro dato.
    */
  register() {
    //Comprueba si hay conexión:
    if(AppGlobals.NETWORK_AVAILABLE){
      //Si hay conexión pero no se ha cargado correctamente el JSON en memoria, vuelve a intentar cargarlo:
      if(AppGlobals.USERS_LIST_LOCAL  === undefined){
        console.log("El JSON NO existía en memoria");
        //Llama al provider que descarga el JSON del servidor y los carga en memoria:
        this.dataAccess.getUsersFromServer().then(data => {
          AppGlobals.USERS_LIST_LOCAL = data;
          AppGlobals.LAST_SYNCHRO = this.genericFunction.timeStamp;

          //Añade el nuevo usuario a la lista en memoria:
          AppGlobals.USERS_LIST_LOCAL.users.push({
            user: this.myForm.value.username,
            email: this.myForm.value.email,
            password: this.myForm.value.password,
            lastUpdate: this.genericFunction.timeStamp,
            accesibility: ''
          });

          //Actualiza los datos en local:
          this.addUser(AppGlobals.USERS_LIST_LOCAL);
        });
      }else{
        console.log("El JSON ya existía en memoria");
        //Añade el nuevo usuario a la lista en memoria:
        AppGlobals.USERS_LIST_LOCAL.users.push({
          user: this.myForm.value.username,
          email: this.myForm.value.email,
          password: this.myForm.value.password,
          lastUpdate: this.genericFunction.timeStamp,
          accesibility: ''
        });

        //Actualiza los datos en local:
        this.addUser(AppGlobals.USERS_LIST_LOCAL);
      }
    }else{
      //No hay conexión pero la lista de usuarios existe en memoria:
      if(AppGlobals.USERS_LIST_LOCAL === undefined && AppGlobals.USERS_LIST_LOCAL.length){
        console.log("No hay conexión pero la lista de usuarios existe en memoria:");
        //Añade el nuevo usuario a la lista en memoria:
        AppGlobals.USERS_LIST_LOCAL.users.push({
          user: this.myForm.value.username,
          email: this.myForm.value.email,
          password: this.myForm.value.password,
          lastUpdate: this.genericFunction.timeStamp,
          accesibility: ''
        });
        //Actualiza los datos en local:
        this.addUser(AppGlobals.USERS_LIST_LOCAL);
      }else{
        this.database.getUsersFromLocal().then(data => {
          if(data){
            console.log("Lista de usuarios recuperada de la BD");
            AppGlobals.USERS_LIST_LOCAL = data;
            AppGlobals.USERS_LIST_LOCAL.users.push({
              user: this.myForm.value.username,
              email: this.myForm.value.email,
              password: this.myForm.value.password,
              lastUpdate: this.genericFunction.timeStamp,
              accesibility: ''
            });
            //Actualiza los datos en local:
            this.addUser(AppGlobals.USERS_LIST_LOCAL);
          }else console.log("No existen datos de usuario en la BD");
        });
      }
    }//If NETWORK_AVAILABLE

    this.nav_login();
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
        this.toast.create({
          message: `Actualización de datos completada.`,
          duration: 3000
        }).present();
      });
      loader.dismiss();
    });
  }

  nav_login(){
    this.navCtrl.push ( LoginPage );
  }

  cancel_register() {
    this.navCtrl.pop();
  }

}
