import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';

@Injectable({    
    providedIn: 'root'
})
export class RolePermissionService {
  constructor (private http: HttpService) {

  }


  addRolePermission(permissionData){
    return this.http.post('local','permission/Add', permissionData);
  }

   getRolePermission(data){
    let params = 'departmentId=' + data.departmentId + '&divisionId=' + data.divisionId + '&resortId=' +data.resortId + '&designationId=' +data.designationId; 
    return this.http.getLocal('local','permission/List?'+params);
  }

 

}
