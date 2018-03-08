import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { HttpClientModule } from "@angular/common/http";

import { HomePage, LoginPage, LoginAsPage, CreateuserPage, IniRegisterPage, IniVisualizerPage, IniSuperuserPage, GeneralinfoPage, RegisterdirectoryPage, RegistersheetPage, RegisterreportPage, CustomizePage, ConfigPage, RegisterPage } from "../pages/index.paginas";

import { MyApp } from './app.component';

import { DataaccessProvider } from '../providers/dataaccess/dataaccess';
import { DatabaseProvider } from '../providers/database/database';
import { SQLite } from '@ionic-native/sqlite';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    LoginAsPage,
    CreateuserPage,
    IniRegisterPage,
    IniVisualizerPage,
    IniSuperuserPage,
    GeneralinfoPage,
    RegisterdirectoryPage,
    RegistersheetPage,
    RegisterreportPage,
    CustomizePage,
    ConfigPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    LoginAsPage,
    CreateuserPage,
    IniRegisterPage,
    IniVisualizerPage,
    IniSuperuserPage,
    GeneralinfoPage,
    RegisterdirectoryPage,
    RegistersheetPage,
    RegisterreportPage,
    CustomizePage,
    ConfigPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataaccessProvider,
    DatabaseProvider,
    SQLite
  ]
})
export class AppModule {}
