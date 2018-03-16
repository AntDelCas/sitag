import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppGlobals, LoginAsPage } from "../index.paginas";
import { DataaccessProvider } from "../../providers/dataaccess/dataaccess";

@Component({
  selector: 'page-customize',
  templateUrl: 'customize.html',
})
export class CustomizePage {
  general_info: any;
  category_selected : boolean = false;
  subcategory_selected : boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public dataAccess: DataaccessProvider)
    {
      let loader = this.loadingCtrl.create({});

      loader.present().then(() => {
        dataAccess.getProductInfo(AppGlobals.PRODUCT_LABEL).then(data => {
          this.general_info = data;
          console.log("Data: ");
          console.log(this.general_info);
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

  //Valida los permisos de registrador:
  categorySelected(category : string){
    console.log("Valor seleccionado: ");
    console.log(category);
    this.category_selected = true;
  }

  get check_categorySelected(){
    if(this.category_selected)
      return false;
    else return true;
  }


  backHome(){
    this.navCtrl.push ( LoginAsPage );
  }
}
