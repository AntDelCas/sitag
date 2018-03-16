import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppGlobals, LoginAsPage } from "../index.paginas";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericfunctionsProvider } from "../../providers/genericfunctions/genericfunctions";


@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
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

  save(){
    //TODO: Enviar nueva configuración al servidor:
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
