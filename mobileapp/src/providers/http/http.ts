import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Injectable, OnInit } from '@angular/core';
import { API } from '../../constants/API.var';
import { DataService } from '../../service';
import { Storage } from '@ionic/storage';
import { catchError } from 'rxjs/operators';
import {of} from 'rxjs/observable/of';



@Injectable()
export class HttpProvider implements OnInit {

  API_ENDPOINT;
  httpOptions;
  currentUser;
  constructor(public http: HttpClient,public dataService:DataService,public basePath: API,public storage :Storage) {
  }

  ngOnInit(){
    this.getHeaders();
  }


  getHeaders() {
      this.storage.get('currentUser').then(
        (val) => {
          this.currentUser = val.token;
          this.httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization':val.token
            })
          };
        }, (err) => {
          console.log('error occured', err);
        });
  }

 private formatErrors(error: any) {  
   let self = this; 
   if(error.status === 403 || error.status === 401){
          console.log("Please log out and login again");
          console.log(this.storage);
          alert('Please Sign out and login again');
          self.dataService.sendLoginData('');
          //this.nav.setRoot('login-page');
          //this.storage.remove('currentUser').then(() => { console.log("removed currentUser") });
			}else{
        return of(error.error);
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

   upload(params,file:Blob){
     this.getHeaders();
     this.API_ENDPOINT =  API['API_LINK'];
     const formData = new FormData();
     formData.append('file',file);
     this.httpOptions = {
         headers: new HttpHeaders({
             'enctype': 'multipart/form-data; boundary=----WebKitFormBoundaryuL67FWkv1CA',
             'Authorization': this.currentUser
         })
     };
     return this.http.post(this.API_ENDPOINT+params, formData,this.httpOptions).pipe(catchError(this.formatErrors));
}

}
