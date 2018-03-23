import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, NgForm } from '@angular/forms';
import { LoadingController } from 'ionic-angular';

import { IniRegisterPage, AppGlobals, LoginAsPage } from "../index.paginas";

import { DatabaseProvider } from '../../providers/database/database';
import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';
import { GenericfunctionsProvider } from '../../providers/genericfunctions/genericfunctions';


@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  schema: any;
  schema_identifier: string;
  general_info: any;
  elements: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public dataAccess: DataaccessProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public database:DatabaseProvider,
    public genericFunction: GenericfunctionsProvider)
  {
    //Carga elementos a rellenar del esquema:
    let loader = this.loadingCtrl.create({});

    if(AppGlobals.NETWORK_AVAILABLE){
      //TODO: se descarga el esquema en función al referenciado por el producto escaneado.
      //TODO: Filtrado por atributo control:
      loader.present().then(() => {
        dataAccess.getProductInfo(AppGlobals.PRODUCT_LABEL).then(data => {
          this.general_info = data;
          this.schema_identifier = this.general_info.registers[0].idSchema;
        }).then(data => {
          dataAccess.getAllSchemas().then(data => {
            AppGlobals.SCHEMA_LIST = data;

            for(let current_schema of AppGlobals.SCHEMA_LIST.registers){
              if(current_schema.idSchema == this.general_info.registers[0].idSchema)
                this.schema = current_schema;
            }

            console.log(this.schema);

            for(let element of this.schema.attributes){
              if(element.control.substring(0,1) == "1")
                this.elements.push(element.name);
            }
            loader.dismiss();
          });
        });
      });
    }else{
      if(AppGlobals.DEFAULT_SCHEMA === undefined || AppGlobals.DEFAULT_SCHEMA.length == 0){
        let alert = this.alertCtrl.create({
          title: '¡Error!',
          subTitle: 'No existe ningún esquema disponible.',
          buttons: ['OK']
        });
        alert.present();
      }else{
        for(let element of AppGlobals.DEFAULT_SCHEMA.registers[0].attributes){
          this.elements.push(element.name);
        }
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  save(data: NgForm) {
    //Extrae las claves generadas en el form:
    let ngForm_keys = Object.keys(data.value);

    //Guarda en memoria los datos introducidos por el usuario:
    //if(si no existe ningún registro) else (hay al menos un registro en memoria)
    if(AppGlobals.REGISTER_SHEET === undefined || AppGlobals.REGISTER_SHEET.length == 0){
        let attributes:any = [];

        for (let key of ngForm_keys){
          attributes.push({
            name: key,
            value: data.value[key],
            category: "",
            // subcategory: "",
            control: "",
            pattern: "",
            comments: "" });
        }

      AppGlobals.REGISTER_SHEET =
        {
        user: AppGlobals.USER,
        countRegisters: "1",
        lastModified: this.genericFunction.timeStamp,
        registers: [
        {
        idSchema: this.general_info.registers[0].idSchema,
        type: this.general_info.registers[0].type,
        label: AppGlobals.PRODUCT_LABEL,
        dateTime: this.genericFunction.timeStamp,//this.general_info.registers[0].dateTime,
        countAttributes: attributes.length.toString(),
        attributes: attributes
        },
        ]
        };
    }else{
      let attributes:any = [];

      let countRegisters:number = AppGlobals.REGISTER_SHEET.countRegisters;
      countRegisters++;

      AppGlobals.REGISTER_SHEET.countRegisters = countRegisters.toString();
      AppGlobals.REGISTER_SHEET.lastModified = this.genericFunction.timeStamp;

      for (let key of ngForm_keys){
          attributes.push({
            name: key,
            value: data.value[key],
            category: "",
            // subcategory: "",
            control: "",
            pattern: "",
            comments: "" });
      }
        AppGlobals.REGISTER_SHEET.registers.push({
          idSchema: this.general_info.registers[0].idSchema,
          type: this.general_info.registers[0].type,
          label: AppGlobals.PRODUCT_LABEL,
          dateTime: this.genericFunction.timeStamp,//this.general_info.registers[0].dateTime,
          countAttributes: attributes.length.toString(),
          attributes: attributes
        });
    }

    this.database.addRegisterToLocal(AppGlobals.USER, JSON.stringify(AppGlobals.REGISTER_SHEET));
    this.genericFunction.mostrar_toast('Datos de registro guardados.');
    this.navCtrl.push ( IniRegisterPage );
  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }

  //Devuelve el label del producto:
  get getProductLabel() {
   return AppGlobals.PRODUCT_LABEL;
  }

  backHome(){
    this.navCtrl.push ( LoginAsPage );
  }
}
