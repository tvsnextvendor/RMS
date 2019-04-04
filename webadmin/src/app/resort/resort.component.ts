import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import {HeaderService} from '../services/header.service';
import {Router} from '@angular/router';
import {ToastrService } from 'ngx-toastr';
import { ResortVar } from '../Constants/resort.var';
import { API_URL } from '../Constants/api_url';
import { AlertService } from '../services/alert.service';
import { UtilService } from '../services/util.service';

@Component({
    selector: 'app-resort',
    templateUrl: './resort.component.html',
    styleUrls: ['./resort.component.css'],
})

export class ResortComponent implements OnInit {
    userType : false;
    selectedDivision;
   constructor(private alertService: AlertService,private location:Location,private resortVar : ResortVar,private utilsService:UtilService,private headerService:HeaderService,private toastr:ToastrService,private router:Router){
    this.resortVar.url = API_URL.URLS;
   }
    
   ngOnInit(){
       let data = this.utilsService.getUserData();
       if(data && data.UserRole && data.UserRole[0] &&  data.UserRole[0].roleId){
            this.userType  = data.UserRole[0].roleId;
       }
    this.headerService.setTitle({title:this.resortVar.title, hidemodule:false});
       this.selectedDivision = this.resortVar.divisionTemplate[0].division;
   }

   addForm(type) {
        if(type === "division"){
            let obj = {
                division: 1,
                divisionName : ''
            };
            this.resortVar.divisionTemplate.push(obj);
        }
        else if(type === "department"){
            let obj = {
                department: 1,
                departmentName : ''
            };
            this.resortVar.departmentTemplate.push(obj);
        }
    }
    
    removeForm(i,type) {
        if(type === "division"){
            this.resortVar.divisionTemplate.splice(i, 1);
        }
        else if(type === 'department'){
            this.resortVar.departmentTemplate.splice(i, 1);
        }
    }

    back(){
        this.location.back();
    }

    submitResortData(){
        console.log(this.resortVar);
    }
}
