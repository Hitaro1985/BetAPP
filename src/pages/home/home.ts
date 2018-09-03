import { Component } from '@angular/core';
import { NavController, App, LoadingController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RestProvider } from '../../providers/rest/rest';
import {Observable} from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loading: any;
  user: any;
  isloggingin: boolean;
  roundcurrentinfo: any;
  roundcurrentdate: string;
  roundlastinfo: any;
  roundlastdate: string;
  lastcloseddate: string;
  lefthours: string;
  leftminutes: any;
  leftseconds: any;
  leftshowone: string;
  leftshowtwo: string;
  passedrounds: any;

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

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public app: App, public rest: RestProvider) {
    this.showLoader();
    if( localStorage.getItem('user') === null) {
      this.isloggingin = false;
    } else {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.isloggingin = true;
    }
    this.getInfo(rest);
    Observable.interval(1000).subscribe( x => {
      this.getInfo(rest);
    });
    this.loading.dismiss();
  }

  getInfo(rest) {
    rest.getHomeInfo().then((result) => {
      if( result['response_code'] == 1 ) {
        this.roundcurrentinfo = result['data']['current'];
        var date1 = new Date(this.roundcurrentinfo['created_at']);
        var ionicDate1 = new Date(Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds(), date1.getMilliseconds()));
        this.roundcurrentdate = String(ionicDate1.getFullYear()) + "-" + String(ionicDate1.getMonth()) + "-" + String(ionicDate1.getDay());
        var now = new Date();
        var elapsed = Math.round((now.getTime() - ionicDate1.getTime()));
        var leftmilis = 30 * 60 * 1000 - elapsed;
        this.lefthours = "00";
        var lm = Math.floor(Math.floor(leftmilis/1000) / 60);
        if (lm < 10) {
          this.leftminutes = "0" + String(lm);
        } else {
          this.leftminutes = String(lm);
        }
        var ls = Math.floor(leftmilis/1000) % 60;
        if (ls < 10) {
          this.leftseconds = "0" + String(ls);
        } else {
          this.leftseconds = String(ls);
        }
        this.leftshowone = String( Math.floor( this.leftminutes / 10 ));
        this.leftshowtwo = String( this.leftminutes % 10 );
        
        this.roundlastinfo = result['data']['last'];
        var date = new Date(this.roundlastinfo['created_at']);
        let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
        this.roundlastdate = String(ionicDate.getFullYear()) + "-" + String(ionicDate.getMonth()) + "-" + String(ionicDate.getDay());
        var date2 = new Date(this.roundlastinfo['updated_at']);
        let ionicDate2 = new Date(Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes(), date2.getSeconds(), date2.getMilliseconds()));
        this.lastcloseddate = "" + ionicDate2.getFullYear() + "-" + ionicDate2.getMonth() + "-" + ionicDate2.getDay() + " " + ionicDate2.getHours() + ":" + ionicDate2.getMinutes() + ":" + ionicDate2.getSeconds();

        this.passedrounds = result['data']['passedround'];
        var i = 0;
        for (let passedround of this.passedrounds) {
          var date3 = new Date(passedround['created_at']);
          var ionicDate3 = new Date(Date.UTC(date3.getFullYear(), date3.getMonth(), date3.getDate(), date3.getHours(), date3.getMinutes(), date3.getSeconds(), date3.getMilliseconds()));
          passedround['name'] = String(ionicDate3.getFullYear()) + "-" + String(ionicDate3.getMonth()) + "-" + String(ionicDate3.getDay()) + "-" + passedround['name'] + ":";
          this.passedrounds[i]['name'] = passedround['name'];
          var rightn = passedround['rightNumber'];
          var firstch = String(Math.floor( rightn / 10));
          var secondch = String( rightn % 10 );
          this.passedrounds[i]['first'] = firstch;
          this.passedrounds[i]['second'] = secondch;
          i = i + 1;
        }
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
