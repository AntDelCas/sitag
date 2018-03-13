import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { LoadingController } from 'ionic-angular';

import { AppGlobals } from "../index.paginas";
import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';



@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  schema: any;
  elements: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public dataAccess: DataaccessProvider,
    public loadingCtrl: LoadingController)
  {
    //Carga elementos a rellenar del esquema:
    let loader = this.loadingCtrl.create({});

    if(AppGlobals.NETWORK_AVAILABLE){

      //TODO: se descarga el esquema en función al referenciado por el producto escaneado.

      loader.present().then(() => {
        dataAccess.getSchema().then(data => {
          this.schema = data;

          for(let element of this.schema.registers[0].attributes){
            this.elements.push(element.name);
          }

          // console.log(this.elements);
          loader.dismiss();
        });
      });
    }else{
      for(let element of AppGlobals.DEFAULT_SCHEMA.registers[0].attributes){
        this.elements.push(element.name);
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  save(data: NgForm) {
    //Extrae las claves generadas en el form:
    let ngForm_keys = Object.keys(data.value);

    for (let key of ngForm_keys){
      console.log("Key: " + key);
      console.log("Value: " + data.value[key]);
    }
  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }

  //Devuelve el label del producto:
  get getProductLabel() {
   return AppGlobals.PRODUCT_LABEL;
  }
}
