import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage, AppGlobals } from "../index.paginas";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  texto_cabecera: string = AppGlobals.TEXTO_CABECERA;

  constructor(public navCtrl: NavController) {

  }


  nav_login(){
    this.navCtrl.push ( LoginPage );
  }

}
