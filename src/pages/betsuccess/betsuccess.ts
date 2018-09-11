import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { DatePipe } from '@angular/common'
import { SocialSharing } from '@ionic-native/social-sharing';
import { commands } from './../../providers/printer/printer-commands';
import { PrinterProvider } from '../../providers/printer/printer';

/**
 * Generated class for the BetsuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-betsuccess',
  templateUrl: 'betsuccess.html',
})
export class BetsuccessPage {

  first: any;
  second: any;
  nowdate: any;
  roundinfo: any;
  agentName: any;
  betNumbers: any;
  total: any;

  constructor(public app: App, public datepipe: DatePipe, public navCtrl: NavController, public navParams: NavParams, public socialSharing: SocialSharing, private toastCtrl: ToastController, private alertCtrl: AlertController, private printer: PrinterProvider, public loadingCtrl: LoadingController) {
    let date = new Date();
    this.nowdate = this.datepipe.transform(date, 'yyyy-MM-dd : HH:mm:ss');
    this.roundinfo = "#" + navParams.get('round') + "(" + String(navParams.get('receipt')) + ")";
    this.agentName = navParams.get('agentName');
    this.betNumbers = navParams.get('betNumbers');
    this.total = navParams.get('total');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BetsuccessPage');
  }

  print() {
    var smess = this.nowdate + " " + this.roundinfo + "\n";
    smess = smess + this.agentName + "\n";
    for( let betst of this.betNumbers) {
      smess = smess + "Number #" + betst[0] + " = MYR " + betst[1] + "\n";
    }
    smess = smess + "Total : MYR " + String(this.total) + "\n";
    smess = smess + "good luck to all boss";
    var title = "recipt";
    let receipt = '';
    receipt += commands.HARDWARE.HW_INIT;
    receipt += commands.TEXT_FORMAT.TXT_4SQUARE;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
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

  share() {
    var smess = this.nowdate + " " + this.roundinfo + "\n";
    smess = smess + this.agentName + "\n";
    for( let betst of this.betNumbers) {
      smess = smess + "Number #" + betst[0] + " = MYR " + betst[1] + "\n";
    }
    smess = smess + "Total : MYR " + String(this.total) + "\n";
    smess = smess + "good luck to all boss";
    this.socialSharing.share(smess, null, null, null)
    .then(() => {
      this.presentToast("Sharing done successfully!");
    }).catch(() => {
      this.presentToast("Not completed sharing!");
    });
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

  close() {
    this.app.getRootNav().pop();
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

}
