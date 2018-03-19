import { Component } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AppGlobals, LoginAsPage, IniSuperuserPage } from "../index.paginas";
import { DataaccessProvider } from "../../providers/dataaccess/dataaccess";
import { GenericfunctionsProvider } from "../../providers/genericfunctions/genericfunctions";

@Component({
  selector: 'page-customize',
  templateUrl: 'customize.html',
})
export class CustomizePage {
  general_info: any = [];
  attributes: any = [];
  category_list: any = [];
  subcategory_list: any = [];
  element_list: any = [];
  current_category: string;
  current_subcategory: string;
  category_selected : boolean = false;
  subcategory_selected : boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public dataAccess: DataaccessProvider,
    public alertCtrl: AlertController,
    public genericFunction: GenericfunctionsProvider)
    {
      let loader = this.loadingCtrl.create({});

      loader.present().then(() => {
        dataAccess.getProductInfo(AppGlobals.PRODUCT_LABEL).then(data => {
          this.general_info.push(data);
          this.attributes.push(this.general_info[0].registers[0].attributes);
          let exists : boolean = false;

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomizePage');
  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }

  //Valida los permisos de registrador y carga el desplegable de subcategoría:
  categorySelected(category : string){
    this.category_selected = true;
    this.subcategory_list = [];
    this.element_list = [];
    this.current_category = category;

    let exists : boolean = false;

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

  subcategorySelected(subcategory : string){
    this.subcategory_selected = true;
    this.element_list = [];
    this.current_subcategory = subcategory;

    for(let attribute of this.attributes[0]){
      if(attribute.category == this.current_category && attribute.subcategory == subcategory)
        this.element_list.push(attribute);
    }
  }

  get check_categorySelected(){
    if(this.category_selected)
      return false;
    else return true;
  }

  get subcheck_categorySelected(){
    if(this.subcategory_selected)
      return false;
    else return true;
  }

  save(data: NgForm) {
    //Extrae las claves generadas en el form:
    let ngForm_keys = Object.keys(data.value);

    for(let attribute of this.attributes[0]){
      for(let key of ngForm_keys)
        if(attribute.category == this.current_category && attribute.subcategory == this.current_subcategory && attribute.name == key)
          attribute.value = data.value[key];
    }
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

  backHome(){
    this.navCtrl.push ( LoginAsPage );
  }
}
