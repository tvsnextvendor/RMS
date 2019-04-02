import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {UtilService } from './util.service';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {API} from '../../app/Constants/api'
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  API_ENDPOINT;
  httpOptions;

  constructor(private http: HttpClient, private utilService:UtilService) {

     this.API_ENDPOINT = API.API_URL;
   // this.API_ENDPOINT = API.API_ENDPOINT;
    
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.utilService.getToken()
      })
    };
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  get(params): Observable<any> {
    return this.http.get(this.API_ENDPOINT+params).pipe(
      map(this.extractData));
  }

  getLocal(api, params): Observable<any> {
    const API_ENDPOINT = api == "local" ? API.API_ENDPOINT:API.API_URL;
    return this.http.get(API_ENDPOINT+params,{headers:this.httpOptions.headers}).pipe(
      map(this.extractData));
  }

  post(api,url,params):Observable<any> {
    const API_ENDPOINT = api == "local" ? API.API_ENDPOINT:API.API_URL;
    return this.http.post(API_ENDPOINT+url,params, {headers:this.httpOptions.headers}).pipe(
      map(this.extractData));
  }

}
