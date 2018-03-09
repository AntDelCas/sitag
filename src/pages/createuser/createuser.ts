import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppGlobals } from "../index.paginas";
import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';

@Component({
  selector: 'page-createuser',
  templateUrl: 'createuser.html',
})
export class CreateuserPage {
  myForm: FormGroup;

  user = { username: '', email: '', password: ''};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public dataAccess: DataaccessProvider) {

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
    //Recupera las variables del formulario:
    this.user.username = this.myForm.value.username;
    this.user.email = this.myForm.value.email;
    this.user.password = this.myForm.value.password;

    //Comprueba si hay conexión:
    if(AppGlobals.NETWORK_AVAILABLE){
      //Si hay conexión pero no se ha cargado correctamente el JSON en memoria, vuelve a intentarlo:
      if(!Array.isArray(AppGlobals.USERS_LIST)){
        //Llama al provider que descarga el JSON del servidor y los carga en memoria:
        this.dataAccess.getUsers().then(data => {
          AppGlobals.USERS_LIST = data;
          AppGlobals.LAST_SYNCHRO = this.dataAccess.timeStamp;

          //Añade el nuevo usuario a la lista en memoria:
          AppGlobals.USERS_LIST.push(this.user);
        });
      }else{
        //Añade el nuevo usuario a la lista en memoria:
        AppGlobals.USERS_LIST.push(this.user);
      }
    }else{
      //No hay conexión pero la lista de usuarios existe en memoria:
      if(Array.isArray(AppGlobals.USERS_LIST) && AppGlobals.USERS_LIST.length){
        //Añade el nuevo usuario a la lista en memoria:
        AppGlobals.USERS_LIST.push(this.user);
      }else{
        //TODO: Aquí se debe comprobar si existen datos en local y cargarlos en memoria si los hubiera.
        //if(datosEnMemoria)
        //AppGlobals.USERS_LIST.push(this.user);
        //else

        //Inicia la variable con el usuario nuevo:
        AppGlobals.USERS_LIST = this.user;
      }
    }//If NETWORK_AVAILABLE
  }

  cancel_register() {
    this.navCtrl.pop();
  }

}
