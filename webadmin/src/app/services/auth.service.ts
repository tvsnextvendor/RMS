import { Injectable } from '@angular/core';
// import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
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
     tap((res)=>{
        if( res.data && res.isSuccess){
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userData',btoa(JSON.stringify(res.data)));
            return true;
        }else{
            localStorage.setItem('error',JSON.stringify(res));
            return false;
        }
     }));

}

}