import { Component } from '@angular/core';
import { IonicPage, NavController, App, LoadingController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RestProvider } from '../../providers/rest/rest';
import { DatePipe } from '@angular/common';

/**
 * Generated class for the ResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

  loading: any;
  user: any;
  isloggingin: boolean;
  datas: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public app: App, public rest: RestProvider, public datepipe:DatePipe) {
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
    this.getInfo();
  }

  ionViewWillLeave() {
  }

  getInfo() {
    this.rest.getResultInfo().then((result) => {
      if( result['response_code'] == 1 ) {
        // this.datas = result['data'];
        // for (let data of this.datas) {
        //   var date3 = new Date(data['created_at']);
        //   var ionicDate3 = new Date(Date.UTC(date3.getFullYear(), date3.getMonth(), date3.getDate(), date3.getHours(), date3.getMinutes(), date3.getSeconds(), date3.getMilliseconds()));
        //   data['created_at'] = this.datepipe.transform(ionicDate3, 'yyyy-MM-dd : HH:mm:ss');
        // }
        this.datas = result['data']['passedround'];
        for (let data of this.datas) {
          var date3 = new Date(data['created_at']);
          var ionicDate3 = new Date(Date.UTC(date3.getFullYear(), date3.getMonth(), date3.getDate(), date3.getHours(), date3.getMinutes(), date3.getSeconds(), date3.getMilliseconds()));
          data['date'] = this.datepipe.transform(ionicDate3, 'yyyy-MM-dd');
          data['time'] = this.datepipe.transform(ionicDate3, 'HH:mm:ss');
          data['first'] = String( Math.floor( data['rightNumber'] / 10 ) );
          data['second'] = String( data['rightNumber'] % 10 );
        }
        console.log(this.datas);
      } else {
        this.presentToast(result['message']);
      }
    }, (err) => {
        this.presentToast("Post Error");
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
