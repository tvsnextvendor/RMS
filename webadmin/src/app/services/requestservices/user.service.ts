import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';

@Injectable({    
    providedIn: 'root'
})
export class UserService {
  constructor (
    private http: HttpService
  ) {}


  addUser(userData){
    return this.http.post('local','user/Add', userData);
  }

  getUser(){
    return this.http.getLocal('local','user/List');
  }

  getUserById(userId){
    return this.http.getLocal('local','user/List?userId='+userId)
  }

  updateUser(userId, userData){
      return this.http.put('local','user/Update/'+userId,userData)
  }

}
