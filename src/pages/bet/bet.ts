import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

/**
 * Generated class for the BetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bet',
  templateUrl: 'bet.html',
})
export class BetPage {
  
  table = [
    { no: 3, color: "#FF0000" }, { no: 6, color: "#1b1623" }, { no: 9, color: "#FF0000" }, { no: 12, color: "#FF0000" },
    { no: 15, color: "#1b1623" }, { no: 18, color: "#FF0000" }, { no: 21, color: "#FF0000" }, { no: 24, color: "#1b1623" },
    { no: 27, color: "#FF0000" }, { no: 30, color: "#FF0000" }, { no: 33, color: "#1b1623" }, { no: 36, color: "#FF0000" },

    { no: 2, color: "#1b1623" }, { no: 5, color: "#FF0000" }, { no: 8, color: "#1b1623" }, { no: 11, color: "#1b1623" },
    { no: 14, color: "#FF0000" }, { no: 17, color: "#1b1623" }, { no: 20, color: "#1b1623" }, { no: 23, color: "#FF0000" },
    { no: 26, color: "#1b1623" }, { no: 29, color: "#1b1623" }, { no: 32, color: "#FF0000" }, { no: 35, color: "#1b1623" },

    { no: 1, color: "#FF0000" }, { no: 4, color: "#1b1623" }, { no: 7, color: "#FF0000" }, { no: 10, color: "#1b1623" },
    { no: 13, color: "#1b1623" }, { no: 16, color: "#FF0000" }, { no: 19, color: "#FF0000" }, { no: 22, color: "#1b1623" },
    { no: 25, color: "#FF0000" }, { no: 28, color: "#1b1623" }, { no: 31, color: "#1b1623" }, { no: 34, color: "#FF0000" },
  ];

  constructor(public app:App, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BetPage');
  }
  
  back() {
    this.app.getRootNav().pop();
  }

}
