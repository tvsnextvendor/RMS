import { Component, OnInit } from '@angular/core';
import {RolePermissionVar} from '../Constants/rolepermission.var';
import { CommonService } from '../services/requestservices/common.service';
import {RolePermissionService} from '../services/requestservices/rolepermission.service';
import {UtilService} from '../services/util.service';
import {HeaderService} from '../services/header.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-rolepermission',
  templateUrl: './rolepermission.component.html',
  styleUrls: ['./rolepermission.component.css']
})
export class RolepermissionComponent implements OnInit {

 
  constructor(private constant:RolePermissionVar,private alertService:AlertService ,private headerService:HeaderService,private commonService:CommonService, private utilService:UtilService, private rolePermissionService:RolePermissionService) {
   }

  ngOnInit() {
    this.headerService.setTitle({title:this.constant.title, hidemodule:false});
    this.commonService.getDivisionList().subscribe((result)=>{
     this.constant.divisionList=result.data.rows;
    })

    this.commonService.getDepartmentList().subscribe((result)=>{
      this.constant.departmentList = result.data.rows;
    })

    this.commonService.getRoleList().subscribe((result)=>{
          this.constant.roleList=result.data;

    })
     this.commonService.getResortList().subscribe((result)=>{
          this.constant.resortList=result.data.rows;
    })
    
  }

  

  checkIfAllSelected(event) {
    const name = event.target.name;
    switch (name) {
      case 'view':
        this.constant.selectAllView = this.constant.modules.every(function(item:any) {
              return item.view == true;
        })
        break;
      case 'upload':
         this.constant.selectAllUpload = this.constant.modules.every(function(item:any) {
                  return item.upload == true;
            })
        break;
       case 'edit':
         this.constant.selectAllEdit = this.constant.modules.every(function(item:any) {
                  return item.edit == true;
            })
        break;
    }
  }

  selectAll(event){
    const name = event.target.name;
    const value = event.target.checked;
    for (var i = 0; i < this.constant.modules.length; i++) {
        this.constant.modules[i][name] = value;
      }
  }


  saveRolePermission(){
    let obj ={
     resortId:this.constant.resortId,
     divisionId:this.constant.divisionId,
     departmentId:this.constant.departmentId,
     roleId:this.constant.roleId,
     menu: this.constant.modules,
     web:this.constant.web,
     mobile:this.constant.mobile,
     userId: this.utilService.getUserData().userId
    }
    this.rolePermissionService.addRolePermission(obj).subscribe((result)=>{
      if(result.isSuccess){
        this.alertService.success(this.constant.messages.successMsg);
        this.clearForm();
      }
    })    
  }


  clearForm(){
  this.constant.resortId="";
  this.constant.divisionId="";
  this.constant.departmentId="";
  this.constant.roleId="";
  this.constant.web= false;
  this.constant.mobile= false;
  this.constant.selectAllView = false;
  this.constant.selectAllUpload=false;
  this.constant.selectAllEdit=false;
  this.constant.modules=this.constant.defaultModules;
  }

}
