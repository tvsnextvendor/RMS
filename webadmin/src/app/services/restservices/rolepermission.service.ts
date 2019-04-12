import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';

@Injectable({    
    providedIn: 'root'
})
export class RolePermissionService {
   port= '3000/';
  constructor (private http: HttpService) {

  }

  addRolePermission(permissionData){
    return this.http.post('local',this.port,'permission/Add', permissionData);
  }

   getRolePermission(data){
    let params = 'departmentId=' + data.departmentId + '&divisionId=' + data.divisionId + '&resortId=' +data.resortId + '&designationId=' +data.designationId + '&web=' +data.web+ '&mobile=' +data.mobile; 
    return this.http.getLocal('local',this.port,'permission/List?'+params);
  }

 

}
