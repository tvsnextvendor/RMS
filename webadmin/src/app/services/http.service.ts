import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  API_ENDPOINT;
  httpOptions;

  constructor(private http: HttpClient) {

   // this.API_ENDPOINT = 'http://localhost:8100/';
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
    return this.http.get(params).pipe(
      map(this.extractData));
  }

}
