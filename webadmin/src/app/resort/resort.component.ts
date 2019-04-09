import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import {HeaderService} from '../services/header.service';
import { HttpService } from '../services/http.service';
import {Router,ActivatedRoute,Params} from '@angular/router';
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
    userType ;
    selectedDivision;
    resortId = '';
    resortDetails;
    submitted = false;
    enableEdit = false;
   constructor(private alertService: AlertService,private activeRoute:ActivatedRoute,private http:HttpService,private location:Location,private resortVar : ResortVar,private utilsService:UtilService,private headerService:HeaderService,private toastr:ToastrService,private router:Router){
    this.activeRoute.params.subscribe((params:Params)=>{
        this.resortId = params['id'] ;
    })
    console.log(this.resortId)
    this.resortVar.url = API_URL.URLS;
   }
    
   ngOnInit(){
        let data = this.utilsService.getUserData();
        if(data && data.UserRole && data.UserRole[0] &&  data.UserRole[0].roleId){
                this.userType  = data.UserRole[0].roleId;
        }
        if(!this.resortId || this.resortId === undefined || this.resortId === null) {
            this.resortVar.title = "Add New Resort";
            this.enableEdit = true;
            this.headerService.setTitle({title:this.resortVar.title, hidemodule:false});
            this.clearData();
        }    
        
        this.selectedDivision = this.resortVar.divisionTemplate[0].division;
        this.http.get(this.resortVar.url.getResortListPageData).subscribe((data) => {
            this.resortDetails = data;
            console.log(this.resortDetails)
            this.resortDetails.forEach(item=>{
                if(item.resortId == this.resortId){
                    this.headerService.setTitle({title:item.resortName, hidemodule:false});
                    this.resortVar.resortName = item.resortName;
                    this.resortVar.location = item.location;
                    this.resortVar.mobile = item.mobile;
                    this.resortVar.email = item.email;
                    this.resortVar.status = item.status;
                    if(this.userType === 1){
                        this.resortVar.storageSpace = item.utilizedSpace;
                        this.resortVar.status = item.status;
                        this.resortVar.allocatedSpace = item.utilizedSpace;
                    }
                }
            })
        });
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
        this.clearData();
        this.location.back();
    }

    editDetails(){
        this.enableEdit=true;
    }

    submitResortData(){
        console.log(this.resortVar);
        this.submitted = true;
        this.clearData();
        this.toastr.success("Resort added successfully");
        this.router.navigateByUrl('/resortslist');
    }

    clearData(){
        this.resortVar.resortName = '';
        this.resortVar.location = '';
        this.resortVar.mobile = '';
        this.resortVar.email = '';
        this.resortId = '';
        this.resortVar.storageSpace = '';
        this.resortVar.status = '';
        this.resortVar.allocatedSpace = '';
    }

}
