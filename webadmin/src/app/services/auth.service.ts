import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'
import { HttpClient, HttpHeaders, HttpResponse ,HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { map, catchError, tap } from 'rxjs/operators';
import {API} from '../../app/Constants/api'
import { Response } from '@angular/http';
import {AuthGuard} from '../guard/auth.guard.component'


@Injectable({
      providedIn: 'root'
})
export class AuthService {
      
API_ENDPOINT;
port= '8101/';
constructor(private http: HttpClient, private router: Router, private authGuard: AuthGuard) { 
    this.API_ENDPOINT = API.API_ENDPOINT;
}

 
login(postData): Observable <any>{
    const headers = new HttpHeaders({ 'Content-Type':'application/json' });
    if(!postData){
        this.router.navigate(['/login']);
    }
    return this.http.post(this.API_ENDPOINT+this.port+'login', postData, {headers: headers}).pipe(
     map((response : any) =>{
        if(response.data){
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userData',btoa(JSON.stringify(response.data)));
            return response;
        }
     }),catchError((error: HttpErrorResponse) => {
         return Observable.throw(error.error);
        }
    ))
  }


  forgetPassword(postData): Observable <any>{
   return this.http.post(this.API_ENDPOINT+this.port+'forgetPassword', postData).pipe(
        map((res) => {
            if (res) {
                return res;
            }
         })
        , catchError((error: HttpErrorResponse) => {
            return Observable.throw(error.error);
        })
    )
  }


  logOut(){
    localStorage.removeItem("userData");
    localStorage.removeItem("user");
    this.authGuard.showSidebar  = false;
    this.authGuard.showHeader = false;
    this.router.navigateByUrl('/login');
  }



}
