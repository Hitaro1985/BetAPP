import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { BetPage } from '../bet/bet';
import { ReportPage } from '../report/report';
import { RestProvider } from '../../providers/rest/rest';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the MyprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myprofile',
  templateUrl: 'myprofile.html',
})
export class MyProfilePage {

  user: any;
  isloggingin: any;
  betPage: any;
  observableVar: Subscription;

  constructor(public app:App, public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, public rest: RestProvider) {
    this.betPage = BetPage;
    if( localStorage.getItem('user') == null ){
      this.app.getRootNav().setRoot(LoginPage);
    } else {
      this.isloggingin = true;
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  getUserData() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.rest.getUserData().then((result) => {
      if ( result['response_code'] == 1) {
        if ( this.user['amount'] != result['data']['amount'] ) {
          localStorage.setItem('user', JSON.stringify(result['data']));
          //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          this.user = JSON.parse(localStorage.getItem('user'));
        } else {
        }
      } else {
        try {
          this.presentToast(result['message']);
          if (result['message'] == "Your account has been blocked") {
            this.presentToast(result['message']);
            this.signout();
          }
        } catch {
          this.presentToast("Post Error");
        }
      }
    }, (err) => {
      try {
        if (err['error']['error'] == "token_invalid" || err['error']['error'] == "token_expired") {
          localStorage.clear();
          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      } catch {
      }
    });
  }

  ionViewDidLoad() {
    if( localStorage.getItem('user') == null ){
      this.app.getRootNav().setRoot(LoginPage);
    }
  }

  ionViewWillEnter() {
    if (localStorage.getItem('user') == null) {
      this.app.getRootNav().setRoot(LoginPage);
    } else if (localStorage.getItem('token') == null) {
      localStorage.clear();
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    } else {
      this.getUserData();
      this.observableVar = Observable.interval(3000).subscribe( x => {
        this.getUserData();
      });
    }
  }

  ionViewWillLeave() {
    this.observableVar.unsubscribe();
  }

  clickBet() {
    this.app.getRootNav().push(BetPage);
    //this.app.getRootNav().push(BetsuccessPage);
  }

  clickReport() {
    this.app.getRootNav().push(ReportPage);
  }

  clickCustomer() {
    console.log("clickCustomer Clicked");
  }

  clickEditPass() {
    console.log("clickEditPass clicked");
  }

  signin(){
    this.app.getRootNav().setRoot(LoginPage);
  }

  signout() {
    localStorage.clear();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
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
