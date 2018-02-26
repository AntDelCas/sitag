import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HomePage, LoginPage, IniRegisterPage, IniVisualizerPage, IniSuperuserPage } from "../pages/index.paginas";

import { MyApp } from './app.component';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    IniRegisterPage,
    IniVisualizerPage,
    IniSuperuserPage
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
    IniRegisterPage,
    IniVisualizerPage,
    IniSuperuserPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
