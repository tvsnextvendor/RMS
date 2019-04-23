import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams, HttpErrorResponse } from '@angular/common/http';
import {UtilService } from './util.service';
import {AuthService} from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {API} from '../../app/Constants/api';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  API_ENDPOINT;
  httpOptions;

  constructor(private http: HttpClient, private utilService:UtilService, private authService: AuthService) {

     this.API_ENDPOINT = API.API_URL;
   // this.API_ENDPOINT = API.API_ENDPOINT;
    
    this.headerAssign();
  }
  headerAssign(){
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
    this.headerAssign();
    return this.http.get(this.API_ENDPOINT+params).pipe(
      map(this.extractData));
  }

  getLocal(api, params): Observable<any> {
    this.headerAssign();
    const API_ENDPOINT = api == "local" ? API.API_ENDPOINT:API.API_URL;
    return this.http.get(API_ENDPOINT+params,{headers:this.httpOptions.headers}).pipe(
      map(this.extractData),
      catchError((error: HttpErrorResponse) => {
         return Observable.throw(error);
        }));
  }

  post(api,url,params):Observable<any> {
    this.headerAssign();
    const API_ENDPOINT = api == "local" ? API.API_ENDPOINT:API.API_URL;
    return this.http.post(API_ENDPOINT+url,params, {headers:this.httpOptions.headers}).pipe(
      map(this.extractData),
      catchError((error: HttpErrorResponse) => {
         return Observable.throw(error);
        }));
  }

  put(api,url, putData): Observable<any> {
    this.headerAssign();
    const API_ENDPOINT = api == "local" ? API.API_ENDPOINT:API.API_URL;
		return this.http.put(API_ENDPOINT+url,putData ,{headers: this.httpOptions.headers}).pipe(
			map(this.extractData),
      catchError((error: HttpErrorResponse) => {
         return Observable.throw(error);
        }));
	}

  delete(api,url,deleteData): Observable<any>{
    this.headerAssign();
    const API_ENDPOINT = api == "local" ? API.API_ENDPOINT:API.API_URL;
		return this.http.request('delete',API_ENDPOINT+url , {headers: this.httpOptions.headers, body: deleteData}).pipe(
		map(this.extractData),
      catchError((error: HttpErrorResponse) => {
         return Observable.throw(error);
        })); 
  }
  

  errorHandler(error: any): void {
    this.headerAssign();
		if(error.status === 403 || error.status === 401){
			this.authService.logOut();
		}
  }
  
  upload(api,url,params):Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.utilService.getToken()
      })
    };
    const API_ENDPOINT = api == "local" ? API.API_ENDPOINT:API.API_URL;
    return this.http.post(API_ENDPOINT+url,params, {headers:httpOptions.headers}).pipe(
      map(this.extractData));
  }

  removeFile(api,url,paramPath):Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.utilService.getToken()
      })
    };
    let paramData = {
      path : paramPath
    }
    const API_ENDPOINT = api == "local" ? API.API_ENDPOINT:API.API_URL;
    return this.http.request('delete',API_ENDPOINT+url, {headers:httpOptions.headers,body:paramData}).pipe(
      map(this.extractData));
  }
  

}
