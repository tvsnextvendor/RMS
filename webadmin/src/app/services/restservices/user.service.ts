import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';
import { API_URL } from '../../Constants/api_url';

@Injectable({    
    providedIn: 'root'
})
export class UserService {
  url;
  constructor (private http: HttpService) {
          this.url = API_URL.URLS;
  }


  addUser(userData){
    return this.http.post('local',this.url.userAdd, userData);
  }

  getUser(userId){
    return this.http.getLocal('local',this.url.userList+'?createdBy='+userId);
  }

  getUserById(userId){
    return this.http.getLocal('local',this.url.userList+'?userId='+userId);
  }

  getUserByDivDept(data){
      return this.http.post('local',this.url.getUserByDivDept, data);
  }

  updateUser(userId, userData){
      return this.http.put('local',this.url.userUpdate+userId,userData)
  }

  activeUser(userId, userData){
    return this.http.put('local',this.url.userUpdate+userId+'?active='+userData.active,userData)
  }

  deleteUser(userId){
    return this.http.delete('local',this.url.userDelete+userId)
  }

  addDivision(params){
    return this.http.post('local',this.url.addDivision, params);
  }

  deleteDivision(id){
    return this.http.delete('local',this.url.deleteDivision+id)
  }

  divisionUpdate(params,id){
    return this.http.put('local',this.url.divisionUpdate+id,params)
  }

  getResortDesignation(resortId){
    return this.http.getLocal('local',this.url.designationList+'?resortId='+resortId);
  }

  addResortDesignation(params){
    return this.http.post('local',this.url.addDesignation, params);
  }

  updateDesignation(id,params){
    return this.http.put('local',this.url.updateDesignation+id,params)
  }

  deleteDesignation(id){
    return this.http.delete('local',this.url.deleteDesignation+id)
  }

  bulkUpload(params,userId,resortId){
    const formData = new FormData();
    formData.append("file",params)
    return this.http.upload('local',this.url.bulkUploadUrl+'?createdBy='+userId+'&resortId='+resortId, formData);
  }

}
