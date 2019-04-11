import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';

@Injectable({    
    providedIn: 'root'
})
export class ResortService {
  constructor (
    private http: HttpService
  ) {}


  addResort(userData){
    return this.http.post('local','resort/Add', userData);
  }

  getResort(){
    return this.http.getLocal('local','resort/List');
  }

  getResortById(resortId){
    return this.http.getLocal('local','resort/List?resortId='+resortId)
  }

  updateResort(resortId, userData){
      return this.http.put('local','resort/Update/'+resortId,userData)
  }

  deleteResort(resortId){
    return this.http.delete('local','resort/Delete/',+resortId)
  }

}
