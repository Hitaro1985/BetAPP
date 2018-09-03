import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, App, LoadingController, ToastController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

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
  loginData = { email:'', password:'' }
  data: any;

  @ViewChild(NavController) navCtrl: NavController;

  constructor(public app: App, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public authService: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signin(){
    //this.app.getRootNav().setRoot(TabsPage);

    this.showLoader();
    this.authService.login(this.loginData).then((result) => {
      this.loading.dismiss();
      this.data = result;
      if( this.data['response_code']  == 1) {
        this.presentToast("login success");
        localStorage.setItem('token', this.data['token']);
        localStorage.setItem('user', JSON.stringify(this.data['user']));
        this.app.getRootNav().setRoot(TabsPage);
        //this.app.getActiveNav().pop();
      } else {
        this.presentToast(this.data['message']);
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast("Post Error");
      console.log(err);
    });
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
