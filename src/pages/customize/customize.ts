import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AppGlobals, LoginAsPage, IniSuperuserPage } from "../index.paginas";
import { DataaccessProvider } from "../../providers/dataaccess/dataaccess";
import { GenericfunctionsProvider } from "../../providers/genericfunctions/genericfunctions";

@Component({
  selector: 'page-customize',
  templateUrl: 'customize.html',
})

/**
  * @name: CustomizePage
  * @description: Permite al usuario owner modificar los datos de los atributos ya guardados en la base de datos de los productos escaneados.
  */
export class CustomizePage {
  /** @description: Cabecera inicial de la aplicación: */
  texto_cabecera: string = AppGlobals.TEXTO_CABECERA;
  /** @description: Datos del producto escaneado. */
  general_info: any = [];
  /** @description: Lista de atributos del producto escaneado. */
  attributes: any = [];
  /** @description: Lista de categorías de los atributos del producto escaneado. */
  category_list: any = [];
  /** @description: Lista de subcategorías de la categoría seleccionada del producto escaneado. */
  subcategory_list: any = [];
  /** @description: Lista de elementos de la subcategoría seleccionada del producto escaneado. */
  element_list: any = [];
  /** @description: Categoría actualmente seleccionada en la interfaz de usuario. */
  current_category: string;
  /** @description: Subcategoría actualmente seleccionada en la interfaz de usuario. */
  current_subcategory: string;
  /**
    * @description: Especifica si hay una categoría seleccionada por el usuario o no.
    * @return false - si no hay categoría seleccionada. true - Si hay categoría seleccionada. */
  category_selected : boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public dataAccess: DataaccessProvider,
    public alertCtrl: AlertController,
    public genericFunction: GenericfunctionsProvider)
    {
      //TODO: ¿Para el owner se muestran todos los atributos que tenga el producto o dependen del esquema?
      let loader = this.loadingCtrl.create({});
      //Descarga la información del producto escaneado del backend
      loader.present().then(() => {
        dataAccess.getProductInfo(AppGlobals.PRODUCT_LABEL).then(data => {
          this.general_info.push(data);
          this.attributes.push(this.general_info[0].registers[0].attributes);
          let exists : boolean = false;

          //Carga en la variable category_list la lista de categorías del producto, evitando repeticiones.
          for(let attribute of this.attributes[0]){
            for(let category of this.category_list)
              if(category == attribute.category)
                exists = true;
            if(!exists)
              this.category_list.push(attribute.category);
            exists = false;
          }
        });
        loader.dismiss();
      });
  }

  /**
    * @name: categorySelected(category : string)
    * @description: Carga las subcategorías dependientes de la categoría que el usuario ha seleccionado en el dropdown menu de categoría.
    * @param: Recibe la categoría seleccionada en el dropdown menú de categoría, en el template.
    */
  categorySelected(category : string){
    //Reinicia los valores de los campos que se muestran el template.
    this.category_selected = true;
    this.subcategory_list = [];
    this.element_list = [];
    this.current_category = category;

    let exists : boolean = false;

    //Carga las subcategorías en el segundo dropdown menu (subcategoria).
    for(let attribute of this.attributes[0]){
      if(category == attribute.category){
        for(let subcategory of this.subcategory_list)
          if(subcategory == attribute.subcategory)
            exists = true;
        if(!exists)
          this.subcategory_list.push(attribute.subcategory);
        exists = false;
      }
    }
  }

  /**
    * @name: subcategorySelected(subcategory : string)
    * @description: Carga los atributos dependientes de la categoría y la subcategoría seleccionada por el usuario en los dropdowns del template.
    * @param: Recibe la subcategoría seleccionada en el dropdown menú de categoría, en el template.
    */
  subcategorySelected(subcategory : string){
    //Reinicia los valores de los campos mostrados en el template.
    this.element_list = [];
    this.current_subcategory = subcategory;

    //Carga la lista de atributos dependientes de la categoría y la subcategoría seleccionada.
    for(let attribute of this.attributes[0]){
      if(attribute.category == this.current_category && attribute.subcategory == subcategory)
        this.element_list.push(attribute);
    }
  }

  /**
    * @name: check_categorySelected
    * @description: informa si hay o no una categoría seleccionada. El template muestra el desplegable de subcategoría en caso de que la haya.
    * @return: false - Si hay una categoría seleccionada. True - Si NO hay una categoría seleccionada.
    */
  get check_categorySelected(){
    if(this.category_selected)
      return false;
    else return true;
  }

  /**
    * @name: save(data : NgForm)
    * @description: Guarda los datos modificados del registro en el backend.
    * @param: Recibe los datos recogidos por el formulario
    */
  save(data: NgForm) {
    //Extrae las claves generadas en el form:
    let ngForm_keys = Object.keys(data.value);

    //Modifica los valores de los atributos modificados por el usuario.
    for(let attribute of this.attributes[0]){
      for(let key of ngForm_keys)
        if(attribute.category == this.current_category && attribute.subcategory == this.current_subcategory && attribute.name == key)
          attribute.value = data.value[key];
    }

    //Comprueba si hay conexión a internet y guarda el registro en el backend. A continuación lo notifica al usuario.
    if(AppGlobals.NETWORK_AVAILABLE){
      this.dataAccess.addRegisterToServer(this.general_info).then(response =>{
        this.navCtrl.push ( IniSuperuserPage );
        this.genericFunction.mostrar_toast('Registro modificado con éxito.');
      });
    }else{
      let alert = this.alertCtrl.create({
        title: '¡Error!',
        subTitle: 'No se puede guardar sin conexión a internet.',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  /**
    * @name: checkValueCategory(value : string)
    * @description: Comprueba si es una categoría vacía y modifica su valor en caso de serlo.
    * @param: El valor de la categoría cargada en el dropdown menu de categorías.
    * @return: Si no es una cadena vacía: El valor de la categoría. Si es una cadena vacía: La cadena "Sin categoría".
    */
  checkValueCategory(value:string){
    if(value == '')
      return 'Sin categoria'
    else
      return value;
  }

  /**
    * @name: checkValueSubcategory(value : string)
    * @description: Comprueba si es una subcategoría vacía y modifica su valor en caso de serlo.
    * @param: El valor de la categoría cargada en el dropdown menu de subcategorías.
    * @return: Si no es una cadena vacía: El valor de la subcategoría. Si es una cadena vacía: La cadena "Sin subcategoría".
    */
  checkValueSubcategory(value:string){
    if(value == '')
      return 'Sin subcategoria'
    else
      return value;
  }

  /**
    * @name: getUsername()
    * @description: Devuelve el nick del usuario que está validado en la aplicación.
    */
  get getUsername() {
   return AppGlobals.USER;
  }

  /**
    * @name: backHome()
    * @description: Navega hacia la interfaz de selección de tipo de usuario.
    */
  backHome(){
    this.navCtrl.push ( LoginAsPage );
  }
}
