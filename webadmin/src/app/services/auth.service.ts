import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'
import { HttpClient, HttpHeaders, HttpResponse ,HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { map, catchError, tap } from 'rxjs/operators';
import {API} from '../../app/Constants/api'

@Injectable({
      providedIn: 'root'
})
export class AuthService {
      
        API_ENDPOINT;
     
constructor(private http: HttpClient, private router: Router) { 
    this.API_ENDPOINT = API.API_ENDPOINT;
}

 private extractData(res: Response) {
    const body = res;
    return body || {};
  }

login(postData): Observable <any>{
    const headers = new HttpHeaders({ 'Content-Type':'application/json' });
    if(!postData){
        this.router.navigate(['/login']);
    }
    return this.http.post(this.API_ENDPOINT+'login', postData, {headers: headers}).pipe(
     map((res: Response) =>{
        if( res.data){
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userData',btoa(JSON.stringify(res.data)));
            return res;
        }
     }),catchError((error: Error) => {
          return Observable.throw(error.error);
        }
    )
  }

}