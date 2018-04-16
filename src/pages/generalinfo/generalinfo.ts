import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AppGlobals, LoginAsPage, IniVisualizerPage, IniRegisterPage, IniSuperuserPage } from "../index.paginas";
import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';
import { GenericfunctionsProvider } from "../../providers/genericfunctions/genericfunctions";


@Component({
  selector: 'page-generalinfo',
  templateUrl: 'generalinfo.html',
})

/**
  * @name: GeneralinfoPage
  * @description: Muestra toda la información disponible del producto escaneado. Depende de los permisos que el esquema del producto tenga en el atributo "control".
  */
export class GeneralinfoPage {
  /** @description: Cabecera inicial de la aplicación: */
  texto_cabecera: string = AppGlobals.TEXTO_CABECERA;
  /** @description: Datos del producto escaneado. */
  general_info: any;
  /** @description: Esquema que da estructura a los datos del producto que serán mostrados al usuario. */
  schema: any;
  /** @description: Identificador del esquema requerido por el producto. */
  schema_identifier: string;
  /** @description: Datos del producto ordenados por categoría. */
  ordered_data : any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataAccess: DataaccessProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public genericFunction: GenericfunctionsProvider)
  {
    if(AppGlobals.NETWORK_AVAILABLE){
      let loader = this.loadingCtrl.create({});
      //TODO: se hace la petición al servidor con el contenido de AppGlobals.PRODUCT_LABEL

      //Muestra un pop-up de carga mientras la información no está disponible:
      loader.present().then(() => {
        let has_valid_schema: boolean = false;
        //Dsecarga la información del producto escaneado.
        dataAccess.getProductInfo(AppGlobals.PRODUCT_LABEL).then(data => {
          this.general_info = data;
          this.schema_identifier = this.general_info.registers[0].idSchema;
        }, (err) => {
          //Lanza un error para que se propague por la cadena de promises:
          throw new Error(err.message);
        }).then(data => {
          //Descarga los esquemas de producto:
          dataAccess.getAllSchemas().then(data => {
            AppGlobals.SCHEMA_LIST = data;

            //Comprueba si existe un esquema válido para el producto escaneado.
            for(let current_schema of AppGlobals.SCHEMA_LIST.registers){
              if(current_schema.idSchema == this.schema_identifier){
                has_valid_schema = true;
                this.schema = current_schema;
              }
            }

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

            //Itera por todos los elementos que tengan categorías que también aparecen en el esquema y si tienen permisos para la visualización, carga los datos
            //en la variable ordered_data, que se mostrará en el template.
            for(let category_index of category){
              let exists = false;
              let generic_info_string = '';

              for(let general_info_index of this.general_info.registers[0].attributes){
                if(category_index == general_info_index.category){
                  control = general_info_index.control.substring(2,3);

                  //Guarda como categoria la cadena "Generic Information" si la categoría estaba vacía.
                  if(category_index == '' && !exists){
                    generic_info_string = 'Generic Information';
                    exists = true;
                  }

                  //Comprueba si el atributo tiene permisos para que sea visualizado por un usuario:
                  if(control == "1"){
                    this.ordered_data.push([
                      {name: general_info_index.name},
                      {value: general_info_index.value},
                      {category: !exists ? category_index : generic_info_string},
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
            this.backMenu();
          }
          loader.dismiss();

          //Si no hay ninguna categoría coincidente entre los datos del producto y los del esquema del producto, se notifica al usuario.
          if(this.ordered_data == 0){
            let alert = this.alertCtrl.create({
              title: 'Aviso',
              subTitle: 'No existen datos disponibles para mostrar.',
              buttons: ['OK']
            });
            alert.present();
          }
        });
      }, (err) => {
        loader.dismiss();
        this.genericFunction.mostrar_toast("Error del scan: " + err);
        this.backMenu();
      });
     });
   }else{
     this.genericFunction.mostrar_toast("No hay conexión a internet.");
   }
  }

  /**
    * @name: getUsername()
    * @description: Devuelve el nick del usuario que está validado en la aplicación.
    */
  get getUsername() {
   return AppGlobals.USER;
  }

  /**
    * @name: getProductLabel()
    * @description: Devuelve la etiqueta de identificación del producto escaneado.
    * @param: La etiqueta de identificación del producto.
    */
  get getProductLabel() {
   return AppGlobals.PRODUCT_LABEL;
  }

  /**
    * @name: backMenu()
    * @description: Navega hacia la interfaz correspondiente según usuario.
    */
  backMenu(){
    if(AppGlobals.IS_OWNER)
      this.navCtrl.push ( IniSuperuserPage );
    else
      if(AppGlobals.IS_REGISTER)
        this.navCtrl.push ( IniRegisterPage );
      else
        this.navCtrl.push ( IniVisualizerPage );
  }

  /**
    * @name: backHome()
    * @description: Navega hacia la interfaz de selección de tipo de usuario.
    */
  backHome(){
    if(!AppGlobals.IS_OWNER && !AppGlobals.IS_REGISTER && !AppGlobals.IS_VISUALIZER)
      this.navCtrl.push ( IniVisualizerPage );
    else
      this.navCtrl.push ( LoginAsPage );
  }
}
