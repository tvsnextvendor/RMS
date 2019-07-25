import {Injectable} from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()

export class DataService {
  
  loginData = new BehaviorSubject(null)
  getLoginData = this.loginData.asObservable();

  constructor() { }
  
  sendLoginData(data) {
      console.log(data,"COUNT");
      this.loginData.next(data);
   }
  
  
}