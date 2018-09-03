import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { LoginPage } from '../login/login';

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

  constructor(public app:App, public navCtrl: NavController, public navParams: NavParams) {
    if( localStorage.getItem('user') == null ){
      this.app.getRootNav().setRoot(LoginPage);
    } else {
      this.isloggingin = true;
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  ionViewDidLoad() {
    if( localStorage.getItem('user') == null ){
      this.app.getRootNav().setRoot(LoginPage);
    }
  }

  clickReport() {
    console.log("clickReport Clicked");
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
