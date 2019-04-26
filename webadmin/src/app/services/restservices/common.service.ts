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

getDesignationList(){
    return this.http.getLocal('local',this.url.designationList);
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

}
