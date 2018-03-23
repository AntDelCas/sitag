import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AppGlobals, LoginAsPage, IniVisualizerPage } from "../index.paginas";
import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';
import { GenericfunctionsProvider } from "../../providers/genericfunctions/genericfunctions";


@Component({
  selector: 'page-generalinfo',
  templateUrl: 'generalinfo.html',
})
export class GeneralinfoPage {
  general_info: any;
  schema: any;
  schema_identifier: string;
  ordered_data : any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataAccess: DataaccessProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public genericFunction: GenericfunctionsProvider)
  {
    let loader = this.loadingCtrl.create({});
    //TODO: se hace la petición al servidor con el contenido de AppGlobals.PRODUCT_LABEL
    //TODO: se descarga el esquema en función al referenciado por el producto escaneado.

    //Muestra un pop-up de carga mientras la información no está disponible:
    loader.present().then(() => {
      let has_valid_schema: boolean = false;

      dataAccess.getProductInfo(AppGlobals.PRODUCT_LABEL).then(data => {
        this.general_info = data;
        this.schema_identifier = this.general_info.registers[0].idSchema;
      }).then(data => {
        dataAccess.getAllSchemas().then(data => {
          AppGlobals.SCHEMA_LIST = data;

          for(let current_schema of AppGlobals.SCHEMA_LIST.registers){
            if(current_schema.idSchema == this.schema_identifier){
              has_valid_schema = true;
              this.schema = current_schema;
            }
          }

          console.log(this.schema);

        if(has_valid_schema){
          //Comprueba el ID del esquema que coincide con los datos de productos descargados.
          //Carga "category" y "subcategory" en el JSON de producto utilizando los datos del esquema para identificar cada atributo.
          if(this.general_info.registers[0].idSchema == this.schema.idSchema){
            let indexI = 0;
            for(let general_info_att of this.general_info.registers[0].attributes){
              let indexJ = 0;
              for(let schema_att of this.schema.attributes){
                if(general_info_att.name == schema_att.name){
                  this.general_info.registers[0].attributes[indexI].category = schema_att.category;
                  this.general_info.registers[0].attributes[indexI].control =  schema_att.control;
                  // this.general_info.registers[0].attributes[indexI].subcategory = schema_att.subcategory;
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

            for(let category_schema of this.schema.attributes){
              if(category_item.category == category_schema.category){
                for(let inner_category of category)
                  if(inner_category == category_item.category)
                    exists = true;
                if(!exists)
                  category.push(category_item.category);
              }
            }
          }

          let control : string;
          console.log(this.general_info.registers[0].attributes);
          for(let category_index of category){
            let exists = false;
            let generic_info_string = '';
            // console.log("CATEGORY - " + category_index);
            for(let general_info_index of this.general_info.registers[0].attributes){
              // console.log("General info: " + general_info_index.category);
              if(category_index == general_info_index.category){
                control = general_info_index.control;//.substring(2,3);
                console.log("Control: " + control);

                if(category_index == '' && !exists){
                  generic_info_string = 'Generic Information';
                  exists = true;
                }
                //TODO: Cambiar control (general_info_index) por control(schema)

                if(control == "1"){
                  this.ordered_data.push([
                    {name: general_info_index.name},
                    {value: general_info_index.value},
                    {category: !exists ? category_index : generic_info_string},
                    // {subcategory: !exists ? general_info_index.subcategory : ""}
                  ]);
                }
                exists = true;
                generic_info_string = '';
              }
            }
          }
        }else{
          loader.dismiss();
          this.genericFunction.mostrar_toast('No existe ningún esquema de datos para este producto.');
          this.navCtrl.push ( IniVisualizerPage );
        }
        //</Ordena>
        loader.dismiss();

        if(this.ordered_data == 0){
          let alert = this.alertCtrl.create({
            title: 'Aviso',
            subTitle: 'No existen datos disponibles para mostrar.',
            buttons: ['OK']
          });
          alert.present();
        }
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

  backHome(){
    if(!AppGlobals.IS_OWNER && !AppGlobals.IS_REGISTER && !AppGlobals.IS_VISUALIZER)
      this.navCtrl.push ( IniVisualizerPage );
    else
      this.navCtrl.push ( LoginAsPage );
  }
}
