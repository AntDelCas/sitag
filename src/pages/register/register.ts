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
  // myForm: FormGroup;
  // public detailsForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public dataAccess: DataaccessProvider,
    public loadingCtrl: LoadingController)
  {
    //Carga elementos a rellenar del esquema:

    let loader = this.loadingCtrl.create({});
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

  //   let daysFormGroup: FormGroup = new FormGroup({});
  //
  //   for (let day of this.elements) {
  //     let control: FormControl = new FormControl(day.value, Validators.required);
  //     daysFormGroup.addControl(day.value, control);
  //   }
  //
  //   this.detailsForm = this.formBuilder.group({
  //     // days: daysFormGroup
  //     family: '',
  //     name: '',
  //     category: ''
  //   });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  save(data: NgForm) {
    console.log("Data value: " + data.value);  // { first: '', last: '' }
    console.log("Data name: " + data.name);
    // for(let prueba of data.value){
    //   console.log(prueba);
    // }
  }

  //Devuelve el nickname:
  get getUsername() {
   return AppGlobals.USER;
  }
}
