import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { MyBetPage } from '../pages/mybet/mybet';
import { ResultPage } from '../pages/result/result';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MyProfilePage } from '../pages/myprofile/myprofile';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { RestProvider } from '../providers/rest/rest';
import { DatePipe } from '@angular/common';
import { BetPage } from '../pages/bet/bet';
import { Printer } from '@ionic-native/printer';
import { ReportPage } from '../pages/report/report';
import { SocialSharing } from '@ionic-native/social-sharing';

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    LoginPage,
    MyBetPage,
    ResultPage,
    HomePage,
    MyProfilePage,
    TabsPage,
    BetPage,
    ReportPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    LoginPage,
    MyBetPage,
    ResultPage,
    HomePage,
    MyProfilePage,
    TabsPage,
    BetPage,
    ReportPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    RestProvider,
    DatePipe,
    Printer,
    SocialSharing
  ]
})
export class AppModule {}
