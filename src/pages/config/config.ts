import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppGlobals, LoginAsPage } from "../index.paginas";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericfunctionsProvider } from "../../providers/genericfunctions/genericfunctions";


@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})

/**
  * @name: ConfigPage
  * @description: Página de configuración del servidor (owner). Permite modificar el puerto y la URL del backend al que se le hacen las consultas.
  */

export class ConfigPage {
  myForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public genericFunction: GenericfunctionsProvider) {
      this.myForm = this.formBuilder.group({
        url: ['', Validators.required],
        port: ['', Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

/**
  * @name: save()
  * @description: Guarda la nueva configuración del servidor (URL y Puerto) y notifica al usuario los cambios.
  */
  save(){
    //TODO: ¿Cómo afecta este cambio a la aplicación?
    this.genericFunction.mostrar_toast('Nueva configuración del servidor guardada con éxito.');
    console.log("URL: ");
    console.log(this.myForm.value.url);
    console.log("Port: ");
    console.log(this.myForm.value.port);
  }

  cancel() {
    this.navCtrl.pop();
  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }

  backHome(){
    this.navCtrl.push ( LoginAsPage );
  }
}
