import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';

@Injectable({    
    providedIn: 'root'
})
export class CommonService {
  port= '3002/';
  constructor (private http: HttpService) {

  }

 getDivisionList(){
    return this.http.getLocal('local',this.port,'division/List');
 }

 getDepartmentList(){
     return this.http.getLocal('local',this.port,'department/List');
 }

 getRoleList(){
     return this.http.getLocal('local',this.port,'role/List');
 }

getResortList(){
    return this.http.getLocal('local',this.port,'resort/List');
}

getDesignationList(){
    return this.http.getLocal('local',this.port,'designation/List');
}

uploadFiles(file){
    const formData = new FormData();
    formData.append("file",file)
    return this.http.upload('local','uploadFiles', formData);
}

removeFiles(path){
    return this.http.removeFile('local','remove', path);
}

}
