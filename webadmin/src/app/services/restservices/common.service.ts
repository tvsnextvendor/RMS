import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';
import { API_URL } from '../../Constants/api_url';

@Injectable({    
    providedIn: 'root'
})
export class CommonService {

  url;

  constructor (private http: HttpService) {
       this.url = API_URL.URLS;
  }
  getResortName() {
    return localStorage.getItem("resortName");
    }

 getDivisionList(){
    return this.http.getLocal('local',this.url.divisionList);
 }
 getCreatedByDetails(){
    return this.http.getLocal('local',this.url.getCreatedByDetails);
  }

 getDepartmentList(data){
      let params = data ? data : '';
      if(params){    
        return this.http.post('local',this.url.departmentList,params);
      }else{
        return this.http.post('local',this.url.departmentList,'');
      }
 }

 getRoleList(){
     return this.http.getLocal('local',this.url.roleList);
 }

getResortList(){
    return this.http.getLocal('local',this.url.resortList);
}

getDesignationList(resortId){
    return this.http.getLocal('local',this.url.designationList+'?resortId='+resortId);
}

uploadFiles(file){
    const formData = new FormData();
    formData.append("file",file)
    return this.http.upload('local',this.url.uploadFiles, formData);
}

removeFiles(params){
    return this.http.removeFile('local',this.url.removeFiles, params);
}

getResortDivision(id){
    return this.http.getLocal('local',this.url.resortDivisionList+id);
}

passwordUpdate(params){
  return this.http.put('local',this.url.userSettings,params);
}

}
