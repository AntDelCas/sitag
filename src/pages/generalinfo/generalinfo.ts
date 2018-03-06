import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppGlobals } from "../index.paginas";
import { DataaccessProvider } from '../../providers/dataaccess/dataaccess';
import { LoadingController } from 'ionic-angular';

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
  attr_latitude: string;
  attr_longitude: string;
  has_location: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataAccess: DataaccessProvider,
    public loadingCtrl: LoadingController)
  {
    let loader = this.loadingCtrl.create({});

    //Muestra un pop-up de carga mientras la información no está disponible:
    loader.present().then(() => {
      dataAccess.getSchema().then(data => {
        this.schema = data;
      });

      dataAccess.getGeneralInfo().then(data => {
        this.general_info = data;

        //Comprueba si se debe mostrar la location:
        for (let entry of this.general_info.registers[0].attributes) {
          if(entry.name == 'latitude' || entry.name == 'longitude'){
            this.has_location = true;

            if(entry.name == 'latitude')
              this.attr_latitude = entry.value;

            if(entry.name == 'longitude')
              this.attr_longitude = entry.value;
          }
        }

        loader.dismiss();
        console.log(this.schema);
        console.log(this.general_info);
      });
   });
  }

  ionViewDidLoad() {

  }

  //Muestra el apartado location en el HTML:
  get hasLocation(){
    if(this.has_location)
      return false;
    else
      return true;
  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }
}
