import {Injectable} from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()

export class DataService {
  
  notificationCount = new BehaviorSubject(null)
  notification = this.notificationCount.asObservable();

  constructor() { }
  
  sendCount(count) {
      console.log(count,"COUNT");
      this.notificationCount.next(count);
   }
  
  
}