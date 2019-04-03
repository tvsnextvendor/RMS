import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';

@Injectable({    
    providedIn: 'root'
})
export class RolePermissionService {
  constructor (
    private http: HttpService
  ) {}


  addRolePermission(permissionData){
    return this.http.post('local','permission/Add', permissionData);
  }

 

}
