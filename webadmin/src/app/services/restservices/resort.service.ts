import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';

@Injectable({    
    providedIn: 'root'
})
export class ResortService {
  port= '3003/';
  constructor (
    private http: HttpService
  ) {}


  addResort(userData){
    return this.http.post('local',this.port,'resort/Add', userData);
  }

  getResort(){
    return this.http.getLocal('local',this.port,'resort/List');
  }

  getResortById(resortId){
    return this.http.getLocal('local',this.port,'resort/List?resortId='+resortId)
  }

  getResortByParentId(resortId){
        return this.http.getLocal('local',this.port,'resort/List?parentResort='+resortId)
  }

  updateResort(resortId, userData){
      return this.http.put('local',this.port,'resort/Update/'+resortId,userData)
  }

  deleteResort(resortId){
    return this.http.delete('local',this.port,'resort/Delete/',+resortId)
  }

}
