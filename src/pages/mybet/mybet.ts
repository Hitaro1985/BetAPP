import { Component } from '@angular/core';
import { NavController, App, LoadingController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RestProvider } from '../../providers/rest/rest';
import { DatePipe } from '@angular/common'
import { Printer, PrintOptions } from '@ionic-native/printer';

@Component({
  selector: 'page-mybet',
  templateUrl: 'mybet.html'
})
export class MyBetPage {

  loading: any;
  user: any;
  isloggingin: boolean;
  datas: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public app: App, public rest: RestProvider, public datepipe: DatePipe) {
    this.showLoader();
    if( localStorage.getItem('user') === null) {
      this.isloggingin = false;
    } else {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.isloggingin = true;
    }
    this.loading.dismiss();
  }

  ionViewWillEnter() {
    if( localStorage.getItem('user') == null ) {
      this.app.getRootNav().setRoot(LoginPage);
    } else if ( localStorage.getItem('token') == null ) {
      localStorage.clear();
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    } else {
      this.getInfo();
    }
  }

  ionViewWillLeave() {
  }

  getInfo() {
    this.rest.getMyBetInfo().then((result) => {
      if( result['response_code'] == 1 ) {
        this.datas = result['data'];
        for (let data of this.datas) {
          var date3 = new Date(data['created_at']);
          var ionicDate3 = new Date(Date.UTC(date3.getFullYear(), date3.getMonth(), date3.getDate(), date3.getHours(), date3.getMinutes(), date3.getSeconds(), date3.getMilliseconds()));
          data['created_at'] = this.datepipe.transform(ionicDate3, 'yyyy-MM-dd : HH:mm:ss');
        }
      } else {
        this.presentToast(result['message']);
      }
    }, (err) => {
      try {
        console.log(err['error']['error']);
        if( err['error']['error'] == "token_invalid" || err['error']['error'] == "token_expired" ) {
          this.presentToast("Token Expired");
          localStorage.clear();
          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      } catch {
        this.presentToast("Post Error");
      }      
    });
  }

  signout() {
    localStorage.clear();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  signin(){
    this.app.getRootNav().setRoot(LoginPage);
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: 'Loading...'
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
