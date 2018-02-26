import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HomePage, LoginPage, LoginAsPage, CreateuserPage, IniRegisterPage, IniVisualizerPage, IniSuperuserPage, GeneralinfoPage, RegisterdirectoryPage, RegistersheetPage, RegisterreportPage } from "../pages/index.paginas";

import { MyApp } from './app.component';


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
    RegisterreportPage
  ],
  imports: [
    BrowserModule,
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
    RegisterreportPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
