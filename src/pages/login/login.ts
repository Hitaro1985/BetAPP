import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, App, LoadingController, ToastController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loading: any;
  loginData = { username:'', password:'' }

  @ViewChild(NavController) navCtrl: NavController;

  constructor(public app: App, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signin(){
    //this.app.getRootNav().setRoot(TabsPage);
    console.log('username:', this.loginData.username);

    console.log('password:', this.loginData.password);

    this.showLoader();
  }

  back() {
    this.app.getRootNav().setRoot(TabsPage);
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: 'Authenticating...'
    });

    this.loading.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
