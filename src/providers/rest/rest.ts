import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

  let apiUrl = 'http://lotbackendapps.skydeveloperonline.com/public/api/'
  //let apiUrl = 'http://localhost:8000/api/'

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  getHomeInfo() {
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl+'round/getHomeInfo', {}, {})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  confirmBet(content) {
    var token = localStorage.getItem('token');
    let headers = new HttpHeaders()
          .set('Accept','application/json')
          .set('content-type','application/json')
          .set('Authorization', 'Bearer ' + token);
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl+'round/confirmBet', JSON.stringify(content), {headers: headers})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  cancelBet(content) {
    var token = localStorage.getItem('token');
    let headers = new HttpHeaders()
          .set('Accept','application/json')
          .set('content-type','application/json')
          .set('Authorization', 'Bearer ' + token);
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl+'round/cancelBet', JSON.stringify(content), {headers: headers})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getReportInfo() {
    var token = localStorage.getItem('token');
    let headers = new HttpHeaders()
          .set('Authorization', 'Bearer ' + token);
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl+'round/getReportInfo', {}, {headers: headers})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getMyBetInfo() {
    var token = localStorage.getItem('token');
    let headers = new HttpHeaders()
          .set('Authorization', 'Bearer ' + token);
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl+'round/getMyBetInfo', {}, {headers: headers})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getRoundInfo() {
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl+'round/getCurrentInfo', {}, {})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getResultInfo() {
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl+'round/getResultInfo', {}, {})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getLastRoundInfo() {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      this.http.post(apiUrl+'round/getLastRoundInfo', {}, {})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

}
