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

  constructor(public app:App, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyprofilePage');
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
    console.log("signin");
    this.app.getRootNav().setRoot(LoginPage);
  }

}
