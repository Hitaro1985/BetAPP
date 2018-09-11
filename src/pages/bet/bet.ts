import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, ToastController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { BetsuccessPage } from '../betsuccess/betsuccess';

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

  corners = {
    "120" : "1|2", "230": "2|3", "140": "1|4", "250": "2|5", "360": "3|6", "450": "4|5", "560": "5|6", "470": "4|7", "580": "5|8"
    , "690": "6|9", "780": "7|8", "890": "8|9", "7100": "7|10", "8110": "8|11", "9120": "9|12", "10110": "10|11", "11120": "11|12", "10130": "10|13", "11140": "11|14"
    , "12150": "12|15", "13140": "13|14", "14150": "14|15", "13160": "13|16", "14170": "14|17", "15180": "15|18", "16170": "16|17", "17180": "17|18", "16190": "16|19", "17200": "17|20"
    , "18210": "18|21", "19200": "19|20", "20210": "20|21", "19220": "19|22", "20230": "20|23", "21240": "21|24", "22230": "22|23", "23240": "23|24", "22250": "22|25", "23260": "23|26"
    , "24270": "24|27", "25260": "25|26", "26270": "26|27", "25280": "25|28", "26290": "26|29", "27300": "27|30", "28290": "28|29", "29300": "29|30", "28310": "28|31"
    , "29320": "29|32", "30330": "30|33", "31320": "31|32", "32330": "32|33", "31340": "31|34", "32350": "32:35", "33360": "33|36", "34350": "34|35", "35360": "35|36"
    , "1245": "1|2|4|5", "2356": "2|3|5|6", "4578": "4|5|7|8", "5689": "5|6|8|9", "781011": "7|8|10|11"
    , "891112": "8|9|11|12", "10111314": "10|11|13|14", "11121415": "11|12|14|15", "13141617": "13|14|16|17", "14151718": "14|15|17|18", "16171920": "16|17|19|20"
    , "17182021": "17|18|20|21", "19202223": "19|20|22|23", "20212324": "20|21|23|24", "22232526": "22|23|25|26", "23242627": "23|24|26|27", "25262829": "25|26|28|29"
    , "26272930": "26|27|29|30", "28293132": "28|29|31|32", "29303233": "29|30|32|33", "31323435": "31|32|34|35", "32333536": "32|33|35|36"
  };

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
    if( amount > 46) {
      text = this.corners[String(amount)];
    } else if( amount > 36 ) {
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
    for ( var k in this.corners ) {
      if( this.betlist[k] ) {
        this.total = this.total + this.betlist[k] * this.amount;
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
          if( i < 37) {
            if( betstate == '') {
              betstate = String(i) + "&" + this.betlist[String(i)] * this.amount;
            } else {
              betstate = betstate + "%" + String(i) + "&" + this.betlist[String(i)] * this.amount;
            }
          } else {
            if( betstate == '') {
              betstate = this.texts[i - 37] + "&" + this.betlist[String(i)] * this.amount;
            } else {
              betstate = betstate + "%" + this.texts[i - 37] + "&" + this.betlist[String(i)] * this.amount;
            }
          }
        }
      }
      for ( var k in this.corners ) {
        if( this.betlist[k] ) {
          if( betstate == '' ) {
            betstate = this.corners[k] + "&" + this.betlist[k] * this.amount;
          } else {
            betstate = betstate + "%" + this.corners[k] + "&" + this.betlist[k] * this.amount;
          }
        }
      }
      this.rest.confirmBet({"betstate":betstate, "totalbet":this.total}).then((result) => {
        if( result['response_code']  == 1) {
          this.presentToast("BET SUCCESS");
          console.log(result['data']);
          console.log(this.betlist);
          this.rebet();
          this.app.getRootNav().push(BetsuccessPage, {
            round: result['data']['round'],
            receipt: result['data']['receiptNumber'],
            agentName: result['data']['name'],
            betNumbers: result['data']['betNumbers'],
            total: result['data']['total']
          });
        } else {
          this.presentToast(result['message']);
        }
      }, (err) => {
        try {
          if( err['error']['error'] == "token_invalid" || err['error']['error'] == "token_expired" ) {
            this.presentToast("Token Expired");
            localStorage.clear();
            this.app.getRootNav().pop();
            this.app.getRootNav().setRoot(TabsPage);
          }
        } catch {
          this.presentToast("Post Error");
        }      
      });
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

  ionViewWillLeave() {
    if( localStorage.getItem('user') == null ){
      this.app.getRootNav().setRoot(LoginPage);
    } else {
      var user = JSON.parse(localStorage.getItem('user'));
      this.rest.getUserData().then((result) => {
        if ( user['amount'] != result['data']['amount'] ) {
          localStorage.setItem('user', JSON.stringify(result['data']));
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
  }

}
