import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';

@Injectable({    
    providedIn: 'root'
})
export class UserService {
   port= '3000/';
  constructor (
    private http: HttpService
  ) {}


  addUser(userData){
    return this.http.post('local',this.port,'user/Add', userData);
  }

  getUser(){
    return this.http.getLocal('local',this.port,'user/List');
  }

  getUserById(userId){
    return this.http.getLocal('local',this.port,'user/List?userId='+userId)
  }

  updateUser(userId, userData){
      return this.http.put('local',this.port,'user/Update/'+userId,userData)
  }

  deleteUser(userId){
    return this.http.delete('local',this.port,'user/Delete/',+userId)
  }

}
