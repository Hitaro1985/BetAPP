import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, ToastController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

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

  loading: any;
  total: any;
  bets: any;
  amount: any;
  betlist: any;

  texts = ["1st", "2nd", "3rd", "1-18", "EVEN", "BLACK", "RED", "ODD", "19-36"];

  constructor(public app:App, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public rest: RestProvider) {
    this.total = 0;
    this.amount = 0;
  }

  ionViewDidLoad() {
  }

  bet(amount) {
    if( this.betlist == null ) {
      this.betlist = {}
    }
    var text;
    if( amount > 36 ) {
      text = this.texts[amount - 37];
    } else {
      text = String(amount);
    }
    if( this.bets == null ) {
      this.bets = text;
    } else {
      this.bets = this.bets + "," + text;
    }
    if(this.betlist[String(amount)]) {
      this.betlist[String(amount)] = this.betlist[String(amount)] + 1;
    } else {
      this.betlist[String(amount)] = 1;
    }
    this.onChangeAmount();
  }

  onChangeAmount() : void {
    this.total = 0;
    var i = 0;
    for(i = 0; i < 46; i ++) {
      if( this.betlist[String(i)] ) {
        this.total = this.total + this.betlist[String(i)] * this.amount;
      }
    }
  }

  rebet() {
    this.total = 0;
    this.betlist = null;
    this.bets = null;
    this.amount = 0;
  }

  submit() {
    if( this.amount == 0 ) {
      this.presentToast("Amount 0 is invalid. Please input amount.");
    } else {
      var betstate;
      betstate = '';
      var i = 0;
      this.showLoader();
      for(i = 0; i < 46; i ++) {
        if( this.betlist[String(i)] ) {
          if( betstate == '') {
            betstate = String(i) + "&" + this.betlist[String(i)] * this.amount;
          } else {
            betstate = betstate + "%" + String(i) + "&" + this.betlist[String(i)] * this.amount;
          }
        }
      }
      this.rest.confirmBet({"betstate":betstate, "totalbet":this.total}).then((result) => {
        if( result['response_code']  == 1) {
          this.presentToast("BET SUCCESS");
        } else {
          this.presentToast(result['message']);
        }
      }, (err) => {
        try {
          console.log(err['error']['error']);
          if( err['error']['error'] == "token_invalid" || err['error']['error'] == "token_expired" ) {
            this.presentToast("Token Expired");
            localStorage.clear();
            this.app.getRootNav().pop();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        } catch {
          this.presentToast("Post Error");
        }      
      });
      this.rebet();
      this.loading.dismiss();
    }
  }
  
  back() {
    this.app.getRootNav().pop();
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
