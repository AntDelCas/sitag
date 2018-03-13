import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppGlobals } from "../index.paginas";
import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';


@Component({
  selector: 'page-generalinfo',
  templateUrl: 'generalinfo.html',
})
export class GeneralinfoPage {
  // "idSchema": "0000",
  // "type": "computers",
  // "label": "EQUCOM_ASUS_551C_PC_LP_05_16_007661_0_000",
  // "dateTime": "",
  // "countAttributes": "12",
  // "attributes"
  // ===== Attributos: =====
  // "name": "name",
  // "value": "Portátil ASUS",
  // "category": "",
  // "subcategory": "",
  // "control": "",
  // "pattern": "",
  // "comments": ""
  general_info: any;
  schema: any;
  ordered_data : any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataAccess: DataaccessProvider,
    public loadingCtrl: LoadingController)
  {
    let loader = this.loadingCtrl.create({});
    //TODO: se hace la petición al servidor con el contenido de AppGlobals.PRODUCT_LABEL
    //TODO: se descarga el esquema en función al referenciado por el producto escaneado.

    //Muestra un pop-up de carga mientras la información no está disponible:
    loader.present().then(() => {
      dataAccess.getSchema().then(data => {
        this.schema = data;
      }).then(data => {

      dataAccess.getGeneralInfo().then(data => {
        this.general_info = data;

        //Comprueba el ID del esquema que coincide con los datos de productos descargados.
        //Carga "category" y "subcategory" en el JSON de producto utilizando los datos del esquema para identificar cada atributo.
        if(this.general_info.registers[0].idSchema == this.schema.registers[0].idSchema){
          let indexI = 0;
          for(let general_info_att of this.general_info.registers[0].attributes){
            let indexJ = 0;
            for(let schema_att of this.schema.registers[0].attributes){
              if(general_info_att.name == schema_att.name){
                this.general_info.registers[0].attributes[indexI].category = schema_att.category;
                this.general_info.registers[0].attributes[indexI].subcategory = schema_att.subcategory;
              }
              indexJ++;
            }
            indexI++;
          }
        }

        //Ordena los datos de producto por "category" y genera la variable para mostrarlo en el HTML:
        // <Ordena>
        let category : any = [];
        let exists : boolean = false;

        for(let category_item of this.general_info.registers[0].attributes){
          exists = false;

          for(let category_exists of category)
            if(category_item.category == category_exists)
              exists = true;

          if(!exists)
            category.push(category_item.category);

        }

        for(let category_index of category){
          let exists = false;
          let generic_info_string = '';

          for(let general_info_index of this.general_info.registers[0].attributes){
            if(category_index == general_info_index.category){
              if(category_index == '' && !exists){
                generic_info_string = 'Generic Information';
                exists = true;
              }

              this.ordered_data.push([
                {name: general_info_index.name},
                {value: general_info_index.value},
                {category: !exists ? category_index : generic_info_string},
                {subcategory: !exists ? general_info_index.subcategory : ""}
              ]);

              exists = true;
              generic_info_string = '';
            }
          }
        }
        //</Ordena>
        loader.dismiss();
      });
    });
   });
  }

  ionViewDidLoad() {

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
