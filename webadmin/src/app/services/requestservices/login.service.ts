import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';

@Injectable({    
    providedIn: 'root'
})
export class LoginService {
  constructor (
    private http: HttpService
  ) {}


  login(loginData){
    return this.http.post('local','login', loginData);
  }
 
}
