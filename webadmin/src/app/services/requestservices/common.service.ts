import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';

@Injectable({    
    providedIn: 'root'
})
export class CommonService {
  constructor (
    private http: HttpService
  ) {}

 getDivisionList(){
    return this.http.getLocal('local','division/List');
 }

 getDepartmentList(){
     return this.http.getLocal('local','department/List');
 }

 getRoleList(){
     return this.http.getLocal('local','role/List');
 }

getResortList(){
    return this.http.getLocal('local','resort/List');
}
 

}
