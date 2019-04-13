import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';
import { API_URL } from '../../Constants/api_url';


@Injectable({    
    providedIn: 'root'
})
export class SubscriptionService {
  
  url;

  constructor (private http: HttpService) {
    this.url = API_URL.URLS;
  }

  addSubscription(data){
    return this.http.post('local', this.url.subscriptionAdd, data);
  }

  
 

}
