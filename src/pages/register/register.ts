import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, NgForm } from '@angular/forms';
import { LoadingController } from 'ionic-angular';

import { AppGlobals } from "../index.paginas";

import { DatabaseProvider } from '../../providers/database/database';
import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';



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
    public database:DatabaseProvider)
  {
    //Carga elementos a rellenar del esquema:
    let loader = this.loadingCtrl.create({});

    if(AppGlobals.NETWORK_AVAILABLE){
      //TODO: se descarga el esquema en función al referenciado por el producto escaneado.
      loader.present().then(() => {
        dataAccess.getProductInfo(AppGlobals.PRODUCT_LABEL).then(data => {
          this.general_info = data;
          this.schema_identifier = this.general_info.registers[0].idSchema;
        }).then(data => {
          dataAccess.getSchema(this.schema_identifier).then(data => {
            this.schema = data;

            for(let element of this.schema.registers[0].attributes){
              this.elements.push(element.name);
            }

            console.log(this.general_info);
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
    //////////////////////////////////
    AppGlobals.REGISTER_SHEET =
{
user: "j.ignacio",
countRegisters: "2",
lastModified: "2018-01-30 12:55:55",
registers: [
{
idSchema: "0000",
type: "computers",
label: "EQUCOM_ASUS_551C_PC_LP_05_16_007660_1_000",
dateTime: "2018-01-30 12:55:55",
countAttributes: "2",
attributes: [
{
name: "latitude",
value: "36.52",
category: "",
subcategory: "",
control: "",
pattern: "",
comments: ""
},
{
name: "longitude",
value: "-6.22",
category: "",
subcategory: "",
control: "",
pattern: "",
comments: ""
}
]
},
{
idSchema: "0000",
type: "computers",
label: "EQUCOM_ASUS_551C_PC_LP_05_16_007661_0_000",
dateTime: "2018-01-30 12:55:55",
countAttributes: "10",
attributes: [
{
name: "name",
value: "Portátil ASUS",
category: "",
subcategory: "",
control: "",
pattern: "",
comments: ""
},
{
name: "family",
value: "Activo de Sinapse",
category: "",
subcategory: "",
control: "",
pattern: "",
comments: ""
},
{
name: "type",
value: "PC",
category: "",
subcategory: "",
control: "",
pattern: "",
comments: ""
},
{
name: "longitude",
value: "-6.22",
category: "",
subcategory: "",
control: "",
pattern: "",
comments: ""
}
]
}
]
}
;

    /////////////////////////////////////
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  save(data: NgForm) {
    //Extrae las claves generadas en el form:
    let ngForm_keys = Object.keys(data.value);

    if(AppGlobals.REGISTER_SHEET === undefined || AppGlobals.REGISTER_SHEET.length == 0){
      // AppGlobals.REGISTER_SHEET.user = AppGlobals.USER;
      // AppGlobals.REGISTER_SHEET.countRegisters = '1';
      // AppGlobals.REGISTER_SHEET.lastModified = this.general_info.lastModified;
      // AppGlobals.REGISTER_SHEET.registers.push(
      //   idSchema: ''
      // );

      console.log(AppGlobals.REGISTER_SHEET);
    }else{
      console.log("Else");
      let attributes:any = [];

      for (let key of ngForm_keys){
          attributes.push({
            name: key,
            value: data.value[key],
            category: "",
            subcategory: "",
            control: "",
            pattern: "",
            comments: "" });
      }

      console.log(AppGlobals.REGISTER_SHEET);

      // console.log("Atributes:");
      // console.log(attributes);

        AppGlobals.REGISTER_SHEET.push({
            idSchema: '5555',
            type: 'mices',
            label: 'talCual',
            dateTime: 'DD/MM/AAAA',
            countAttributes: '+1',
            attributes: attributes
        });

      console.log(AppGlobals.REGISTER_SHEET);
    }

    // for (let key of ngForm_keys){
    //   console.log("Key: " + key);
    //   console.log("Value: " + data.value[key]);
    // }
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
