import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppGlobals } from "../index.paginas";
import { ToastController } from 'ionic-angular';

import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';
import { DatabaseProvider } from '../../providers/database/database';

import { LoginPage } from "../index.paginas";

@Component({
  selector: 'page-createuser',
  templateUrl: 'createuser.html',
})
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
    public database:DatabaseProvider
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

  //TODO: Fallo al cancelar registro, revisar.

  register() {
    //Comprueba si hay conexión:
    if(AppGlobals.NETWORK_AVAILABLE){
      //Si hay conexión pero no se ha cargado correctamente el JSON en memoria, vuelve a intentarlo:
      // if(!Array.isArray(AppGlobals.USERS_LIST_LOCAL)){
      if(AppGlobals.USERS_LIST_LOCAL  === undefined){
        console.log("El JSON NO existía en memoria");
        //Llama al provider que descarga el JSON del servidor y los carga en memoria:
        this.dataAccess.getUsersFromServer().then(data => {
          AppGlobals.USERS_LIST_LOCAL = data;
          AppGlobals.LAST_SYNCHRO = this.dataAccess.timeStamp;

          //Añade el nuevo usuario a la lista en memoria:
          AppGlobals.USERS_LIST_LOCAL.users.push({
            user: this.myForm.value.username,
            email: this.myForm.value.email,
            password: this.myForm.value.password,
            lastUpdate: this.dataAccess.timeStamp,
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
          lastUpdate: this.dataAccess.timeStamp,
          accesibility: ''
        });

        //Actualiza los datos en local:
        this.addUser(AppGlobals.USERS_LIST_LOCAL);

        for(let prueba of AppGlobals.USERS_LIST_LOCAL.users)
          console.log("Usuario: " + prueba.user + " Password: " + prueba.password);
        console.log(AppGlobals.USERS_LIST_LOCAL.users);
      }
    }else{
      //No hay conexión pero la lista de usuarios existe en memoria:
      // if(Array.isArray(AppGlobals.USERS_LIST_LOCAL) && AppGlobals.USERS_LIST_LOCAL.length){
      if(AppGlobals.USERS_LIST_LOCAL === undefined && AppGlobals.USERS_LIST_LOCAL.length){
        console.log("No hay conexión pero la lista de usuarios existe en memoria:");
        //Añade el nuevo usuario a la lista en memoria:
        AppGlobals.USERS_LIST_LOCAL.users.push({
          user: this.myForm.value.username,
          email: this.myForm.value.email,
          password: this.myForm.value.password,
          lastUpdate: this.dataAccess.timeStamp,
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
              lastUpdate: this.dataAccess.timeStamp,
              accesibility: ''
            });
            //Actualiza los datos en local:
            this.addUser(AppGlobals.USERS_LIST_LOCAL);
          }else console.log("No existen datos de usuario en la BD");
        });

        //TODO: Aquí se debe comprobar si existen datos en local y cargarlos en memoria si los hubiera.
        //if(datosEnMemoria)
        //AppGlobals.USERS_LIST.push(this.user);
        //else

        //Inicia la variable con el usuario nuevo:
        // AppGlobals.USERS_LIST = this.user;
      }
    }//If NETWORK_AVAILABLE

    this.nav_login();
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

  nav_login(){
    this.navCtrl.push ( LoginPage );
  }

  cancel_register() {
    this.navCtrl.pop();
  }

}
