import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../../constants/API.var';
import { Storage } from '@ionic/storage';


@Injectable()
export class HttpProvider {
  API_ENDPOINT;
  httpOptions;
  constructor(public http: HttpClient, public basePath: API,public storage :Storage) {

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

          console.log(val);
          console.log("storage val",val);

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

  get(url) {
    this.API_ENDPOINT = API['API_LINK'];
    return this.http.get(this.API_ENDPOINT+url, this.httpOptions);
  }
  getData(url) {
    this.API_ENDPOINT = API['API_URL'];
    return this.http.get(this.API_ENDPOINT + url);
  }
  post(mockyStatus, params, data) {
    this.API_ENDPOINT = (mockyStatus) ? API['API_URL'] : API['API_LINK'];
    let body = JSON.stringify(data);
    return this.http.post(this.API_ENDPOINT + params, body, this.httpOptions);
  }
  put(mockyStatus, data) {
    this.API_ENDPOINT = (mockyStatus) ? API['API_URL'] : API['API_LINK'];
    let body = JSON.stringify(data);
    return this.http.put(this.API_ENDPOINT + data.id, body, this.httpOptions);
  }
  delete(mockyStatus, data) {
    this.API_ENDPOINT = (mockyStatus) ? API['API_URL'] : API['API_LINK'];
    return this.http.delete(this.API_ENDPOINT + data.id);
  }

}
