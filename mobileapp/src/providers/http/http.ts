import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../../constants/API.var';


@Injectable()
export class HttpProvider {
  API_ENDPOINT;
  httpOptions;
  constructor(public http: HttpClient, public basePath: API) {
    this.API_ENDPOINT = API['API_URL'];
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  get(url) {
    return this.http.get(url);
  }
  getData(url) {
    return this.http.get(this.API_ENDPOINT + url);
  }
  post(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.API_ENDPOINT, body, this.httpOptions);
  }
  put(data) {
    let body = JSON.stringify(data);
    return this.http.put(this.API_ENDPOINT + data.id, body, this.httpOptions);
  }
  delete(data) {
    return this.http.delete(this.API_ENDPOINT + data.id);
  }

}
