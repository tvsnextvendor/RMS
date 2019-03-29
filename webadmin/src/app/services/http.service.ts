import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {API} from '../../app/Constants/api'
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  API_ENDPOINT;
  httpOptions;

  constructor(private http: HttpClient) {

    this.API_ENDPOINT = API.API_URL;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
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

  post(url,params):Observable<any> {
    return this.http.post(this.API_ENDPOINT+url,params).pipe(
      map(this.extractData));
  }

}
