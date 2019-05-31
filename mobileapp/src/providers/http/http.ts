import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../../constants/API.var';
import { Storage } from '@ionic/storage';
import { _throw as throwError } from 'rxjs/observable/throw';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpProvider {
  API_ENDPOINT;
  httpOptions;
  constructor(public http: HttpClient,public basePath: API,public storage :Storage) {

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.getHeaders();
  }

  getHeaders() {
    let self = this;
    return new Promise(resolve => {
      this.storage.get('currentUser').then(
        (val) => {
          self.httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization':(val)?val.token:''
            })
          };
         
          resolve('resolved');
        }, (err) => {
          console.log('error occured', err);
          resolve('rejected');
        });
    });
  }

 private formatErrors(error: any) {   
   if(error.status === 403 || error.status === 401){
			   // this.storage.remove('userDashboardInfo').then(() => { console.log("removed userDashboardInfo") });
          this.storage.remove('currentUser').then(() => { console.log("removed currentUser") });
			}else{
			 return  throwError(error.error);
			}  
  }

  get(url) {
    this.getHeaders();
    this.API_ENDPOINT = API['API_LINK'];
    return this.http.get(this.API_ENDPOINT+url, this.httpOptions). pipe(catchError(this.formatErrors));
  }

  getData(url) {
    this.getHeaders();
    this.API_ENDPOINT = API['API_URL'];
    return this.http.get(this.API_ENDPOINT + url). pipe(catchError(this.formatErrors));
  }
  post(mockyStatus, params, data) {
    this.getHeaders();
    this.API_ENDPOINT = (mockyStatus) ? API['API_URL'] : API['API_LINK'];
    let body = JSON.stringify(data);
    return this.http.post(this.API_ENDPOINT + params, body, this.httpOptions). pipe(catchError(this.formatErrors));
  }
  put(mockyStatus, params, data) {
    this.getHeaders();
    this.API_ENDPOINT = (mockyStatus) ? API['API_URL'] : API['API_LINK'];
    let body = JSON.stringify(data);
    return this.http.put(this.API_ENDPOINT + params, body, this.httpOptions). pipe(catchError(this.formatErrors));
  }
  delete(params) {
    this.getHeaders();
    this.API_ENDPOINT = API['API_LINK'];
    return this.http.delete(this.API_ENDPOINT +params,  this.httpOptions). pipe(catchError(this.formatErrors));
  }

}
