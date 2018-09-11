import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { BetPage } from '../bet/bet';
import { ReportPage } from '../report/report';
import { RestProvider } from '../../providers/rest/rest';
import { BetsuccessPage } from '../betsuccess/betsuccess';

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

  constructor(public app:App, public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider) {
    this.betPage = BetPage;
    if( localStorage.getItem('user') == null ){
      this.app.getRootNav().setRoot(LoginPage);
    } else {
      this.isloggingin = true;
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  getUserData() {
    this.rest.getUserData().then((result) => {
      if ( this.user['amount'] != result['data']['amount'] ) {
        localStorage.setItem('user', JSON.stringify(result['data']));
        //this.navCtrl.setRoot(this.navCtrl.getActive().component);
        this.user = JSON.parse(localStorage.getItem('user'));
      } else {
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
    this.getUserData();
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

}
