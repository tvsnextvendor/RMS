import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';
import { API_URL } from '../../Constants/api_url';

@Injectable({    
    providedIn: 'root'
})
export class ResortService {
  url;
  constructor (private http: HttpService) {
      this.url = API_URL.URLS;
  }

  addResort(userData){
    return this.http.post('local',this.url.resortAdd, userData);
  }

  getResort(){
    return this.http.getLocal('local',this.url.resortList);
  }

  getResortById(resortId){
    return this.http.getLocal('local',this.url.resortList+'?resortId='+resortId)
  }

  getResortByParentId(resortId){
        return this.http.getLocal('local',this.url.getResortDivision+'?Resort='+resortId+'&type=division')
  }
  updateResort(resortId, userData){
      return this.http.put('local',this.url.resortUpdate+resortId,userData)
  }
  deleteResort(resortId){
    return this.http.delete('local',this.url.resortDelete+resortId)
  }
  getApprovalList(resortId,userId,status){
    return this.http.getLocal('local',this.url.listApproval+'?resortId='+resortId+'&approvalStatus='+status+'&createdBy='+userId);
  }
  statusApproval(approvalId, approvalInfo){
    return this.http.put('local',this.url.statusApproval+approvalId,approvalInfo)
  }

}
