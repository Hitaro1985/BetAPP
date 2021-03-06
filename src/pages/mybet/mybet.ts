import { Component } from '@angular/core';
import { AlertController, NavController, App, LoadingController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RestProvider } from '../../providers/rest/rest';
import { DatePipe } from '@angular/common'
import { SocialSharing } from '@ionic-native/social-sharing';
import { TabsPage } from '../tabs/tabs';
import { PrinterProvider } from './../../providers/printer/printer';
import { commands } from './../../providers/printer/printer-commands';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-mybet',
  templateUrl: 'mybet.html'
})
export class MyBetPage {

  loading: any;
  user: any;
  isloggingin: boolean;
  datas: any;
  observableVar: Subscription;
  observableVar3: Subscription;
	cur_page_num :number = 1;
	page_count;
	count_per_page = 10;


  constructor(public navCtrl: NavController, private printer: PrinterProvider, private alertCtrl: AlertController, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public app: App, public rest: RestProvider, public datepipe: DatePipe, public socialSharing: SocialSharing) {
    this.showLoader();
    if (localStorage.getItem('user') === null) {
      this.isloggingin = false;
    } else {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.isloggingin = true;
    }
    this.loading.dismiss();
  }

  noSpecialChars(string) {
    var translate = {
        "à": "a",
        "á": "a",
        "â": "a",
        "ã": "a",
        "ä": "a",
        "å": "a",
        "æ": "a",
        "ç": "c",
        "è": "e",
        "é": "e",
        "ê": "e",
        "ë": "e",
        "ì": "i",
        "í": "i",
        "î": "i",
        "ï": "i",
        "ð": "d",
        "ñ": "n",
        "ò": "o",
        "ó": "o",
        "ô": "o",
        "õ": "o",
        "ö": "o",
        "ø": "o",
        "ù": "u",
        "ú": "u",
        "û": "u",
        "ü": "u",
        "ý": "y",
        "þ": "b",
        "ÿ": "y",
        "ŕ": "r",
        "À": "A",
        "Á": "A",
        "Â": "A",
        "Ã": "A",
        "Ä": "A",
        "Å": "A",
        "Æ": "A",
        "Ç": "C",
        "È": "E",
        "É": "E",
        "Ê": "E",
        "Ë": "E",
        "Ì": "I",
        "Í": "I",
        "Î": "I",
        "Ï": "I",
        "Ð": "D",
        "Ñ": "N",
        "Ò": "O",
        "Ó": "O",
        "Ô": "O",
        "Õ": "O",
        "Ö": "O",
        "Ø": "O",
        "Ù": "U",
        "Ú": "U",
        "Û": "U",
        "Ü": "U",
        "Ý": "Y",
        "Þ": "B",
        "Ÿ": "Y",
        "Ŕ": "R"
      },
      translate_re = /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŕŕÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÝÝÞŸŔŔ]/gim;
    return (string.replace(translate_re, function (match) {
      return translate[match];
    }));
  }

  ionViewWillEnter() {
    if (localStorage.getItem('user') == null) {
      this.app.getRootNav().setRoot(LoginPage);
    } else if (localStorage.getItem('token') == null) {
      localStorage.clear();
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    } else {
      this.getInfo();
      this.getUserData();
      this.observableVar3 = Observable.interval(3000).subscribe( x => {
        this.getUserData();
      });
      this.observableVar = Observable.interval(1000).subscribe( x => {
        this.getInfo();
      });
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
          this.presentToast("Token Expired");
          localStorage.clear();
          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      } catch {
        this.presentToast("Post Error");
      }
    });
  }

  ionViewWillLeave() {
    this.observableVar.unsubscribe();
    this.observableVar3.unsubscribe();
  }

  getInfo() {
    this.rest.getMyBetInfo({"cur_page_num":this.cur_page_num, "count_per_page":this.count_per_page}).then((result) => {
      if (result['response_code'] == 1) {
        
        this.page_count = Math.ceil(result['total_count'] / (this.count_per_page * 1.0));
        
        this.datas = result['data'];
        for (let data of this.datas) {
          var date3 = new Date(data['created_at']);
          var ionicDate3 = new Date(Date.UTC(date3.getFullYear(), date3.getMonth(), date3.getDate(), date3.getHours(), date3.getMinutes(), date3.getSeconds(), date3.getMilliseconds()));
          data['created_at'] = this.datepipe.transform(ionicDate3, 'yyyy-MM-dd : HH:mm:ss');
        }
      } else {
        try {
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
          this.presentToast("Token Expired");
          localStorage.clear();
          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      } catch {
        this.presentToast("Post Error");
      }
    });
  }

	public go_to_page(page) {
		if (page < 1) page = 1;
		if (page > this.page_count) page = this.page_count;
		this.cur_page_num = page;

		this.getInfo();
	}

  cancelbet(i) {
    let alert = this.alertCtrl.create({
      title: 'Confirm cancel',
      message: 'Do you want to cancel this bet?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.rest.cancelBet({"id":this.datas[i]['id']}).then((result) => {
              if( result['response_code']  == 1) {
                this.presentToast("CANCEL BET SUCCESS");
                this.navCtrl.setRoot(this.navCtrl.getActive().component);
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
          }
        }
      ]
    });
    alert.present();
  }

  printData(device, data) {
    console.log('Device mac: ', device);
    console.log('Data: ', data);
    let load = this.loadingCtrl.create({
      content: 'Printing...'
    }); 
    load.present();
    this.printer.connectBluetooth(device).subscribe(status => {
        console.log(status);
        this.printer.printData(this.noSpecialChars(data))
          .then(printStatus => {
            console.log(printStatus);
            let alert = this.alertCtrl.create({
              title: 'Successful print!',
              buttons: ['Ok']
            });
            load.dismiss();
            alert.present();
            this.printer.disconnectBluetooth();
          })
          .catch(error => {
            console.log(error);
            let alert = this.alertCtrl.create({
              title: 'There was an error printing, please try again!',
              buttons: ['Ok']
            });
            load.dismiss();
            alert.present();
            this.printer.disconnectBluetooth();
          });
      },
      error => {
        console.log(error);
        let alert = this.alertCtrl.create({
          title: 'There was an error connecting to the printer, please try again!',
          buttons: ['Ok']
        });
        load.dismiss();
        alert.present();
      });
  }

  print(i) {
    var smess = this.datas[i]['created_at'] + " #" + this.datas[i]['roundinfo'] + "\n";
    smess = smess + this.datas[i]['name'] + "\n";
    //smess = this.datas[i]['name'] + this.datas[i]['round'] + "\n";
    for( let betst of this.datas[i]['betstate']) {
      smess = smess + betst + "\n";
    }
    smess = smess + "Total : MYR" + String(this.datas[i]['total']) + "\n";
    if( this.datas[i]['wls']) {
      smess = smess + this.datas[i]['wls'];
    } else {
      smess = smess + "Running";
    }
    smess = smess + "\ngood luck to all boss";
    var title = "LL";
    let receipt = '';
    receipt += commands.HARDWARE.HW_INIT;
    receipt += commands.TEXT_FORMAT.TXT_4SQUARE;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += commands.TEXT_FORMAT.TXT_FONT_A;
    receipt += title.toUpperCase();
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.HORIZONTAL_LINE.HR_58MM;
    receipt += commands.EOL;
    receipt += commands.HORIZONTAL_LINE.HR2_58MM;
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += smess;
    //secure space on footer
    receipt += commands.EOL;
    receipt += commands.EOL;
    receipt += commands.EOL;
    let alert = this.alertCtrl.create({
      title: 'Select your printer',
      buttons: [{
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Select printer',
          handler: (device) => {
            if(!device){
              this.presentToast('Select a printer!');
              return false;
            }
            console.log(device);
            this.printData(device, receipt);
          }
        }
      ]
    });

    this.printer.enableBluetooth().then(() => {
      this.printer.searchBluetooth().then(devices => {
        devices.forEach((device) => {
          console.log('Devices: ', JSON.stringify(device));
          alert.addInput({
            name: 'printer',
            value: device.address,
            label: device.name,
            type: 'radio'
          });
        });
        alert.present();
      }).catch((error) => {
        console.log(error);
        this.presentToast('There was an error connecting the printer, please try again!');
      });
    }).catch((error) => {
      console.log(error);
      this.presentToast('Error activating bluetooth, please try again!');
    });
  }

  share(i) {
    var smess = this.datas[i]['created_at'] + " #" + this.datas[i]['roundinfo'] + "\n";
    smess = smess + this.datas[i]['name'] + "\n";
    //smess = this.datas[i]['name'] + this.datas[i]['round'] + "\n";
    for( let betst of this.datas[i]['betstate']) {
      smess = smess + betst + "\n";
    }
    smess = smess + "Total : MYR" + String(this.datas[i]['total']) + "\n";
    if( this.datas[i]['wls']) {
      smess = smess + this.datas[i]['wls'];
    } else {
      smess = smess + "Running";
    }
    smess = smess + "\ngood luck to all boss";
    this.socialSharing.share(smess, null, null, null)
    .then(() => {
      this.presentToast("Sharing done successfully!");
    }).catch(() => {
      this.presentToast("Not completed sharing!");
    });
  }

  signout() {
    localStorage.clear();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  signin() {
    this.app.getRootNav().setRoot(LoginPage);
  }

  showLoader() {
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
