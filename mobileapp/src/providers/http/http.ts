import { HttpClient, HttpHeaders } from '@angular/common/http';
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
                    'Authorization': val.token
                })
            };
        }, (err) => {
            console.log('error occured', err);
        });

      this.dataService.getLoginData.subscribe(res=>{
        if(res){
          this.currentUser = res.token;
          this.httpOptions = {
              headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Authorization': res.token
              })
          };
        }
      })
     
  }

   formatErrors(error: any) {  
    let self = this; 
    if(error.status === 403 || error.status === 401){
            console.log("cleared storage")
            this.storage.remove('currentUser').then(() => {
                this.dataService.sendLoginData('');          
            })
        }else{
          return of(error.error);
        }  
    }

  get(url) {
    this.getHeaders();
    this.API_ENDPOINT = API['API_LINK'];
    return this.http.get(this.API_ENDPOINT+url, this.httpOptions)
    .catch(error => {
        return this.formatErrors(error);
     });
  }

  getData(url) {
    this.getHeaders();
    this.API_ENDPOINT = API['API_URL'];
    return this.http.get(this.API_ENDPOINT + url)
      .catch(error => {
        return this.formatErrors(error);
     });
  }

  post(mockyStatus, params, data) {
    this.getHeaders();
    this.API_ENDPOINT = (mockyStatus) ? API['API_URL'] : API['API_LINK'];
    let body = JSON.stringify(data);
    return this.http.post(this.API_ENDPOINT + params, body, this.httpOptions)
      .catch(error => {
        return this.formatErrors(error);
     });
  }

  put(mockyStatus, params, data) {
    this.getHeaders();
    this.API_ENDPOINT = (mockyStatus) ? API['API_URL'] : API['API_LINK'];
    let body = JSON.stringify(data);
    return this.http.put(this.API_ENDPOINT + params, body, this.httpOptions)
      .catch(error => {
        return this.formatErrors(error);
     });
  }

  delete(params) {
    this.getHeaders();
    this.API_ENDPOINT = API['API_LINK'];
    return this.http.delete(this.API_ENDPOINT +params,  this.httpOptions)
      .catch(error => {
        return this.formatErrors(error);
     });
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
     return this.http.post(this.API_ENDPOINT+params, formData,this.httpOptions)
       .catch(error => {
        return this.formatErrors(error);
     });
}

}
