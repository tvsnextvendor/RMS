import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';
import { API_URL } from '../../Constants/api_url';

@Injectable({    
    providedIn: 'root'
})
export class RolePermissionService {
  url;
  constructor (private http: HttpService) {
     this.url = API_URL.URLS;
  }
  addRolePermission(permissionData){
    return this.http.post('local',this.url.permissionAdd, permissionData);
  }
  getRolePermission(data){
    let params = 'departmentId=' + data.departmentId + '&divisionId=' + data.divisionId + '&resortId=' +data.resortId + '&designationId=' +data.designationId + '&web=' +data.web+ '&mobile=' +data.mobile; 
    return this.http.getLocal('local',this.url.permissionList+'?'+params);
  }
  getRolePermissions(query){
    return this.http.getLocal('local', this.url.getRolePermissions + query);
  }
}
