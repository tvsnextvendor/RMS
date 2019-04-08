import { Component, OnInit } from '@angular/core';
import {RolePermissionVar} from '../Constants/rolepermission.var';
import { CommonService } from '../services/restservices/common.service';
import {RolePermissionService} from '../services/restservices/rolepermission.service';
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

    this.commonService.getDesignationList().subscribe((result)=>{
          this.constant.roleList=result.data.rows;

    })
     this.commonService.getResortList().subscribe((result)=>{
          this.constant.resortList=result.data.rows;
    })
    
  }

   getRolePermission(){
      this.constant.modules = RolePermissionVar.defaultModules;
      this.constant.selectAllView = false;
      this.constant.selectAllUpload=false;
      this.constant.selectAllEdit=false;
      let data:any={};
      data.divisionId = this.constant.divisionId;
      data.departmentId = this.constant.departmentId;
      data.resortId = this.constant.resortId;
      data.designationId = this.constant.roleId;
      data.web=this.constant.web;
      data.mobile=this.constant.mobile;
      this.rolePermissionService.getRolePermission(data).subscribe((result)=>{
        if(result.isSuccess){
        this.constant.modules = result.data.rows[0].userPermission;
         this.constant.selectAllView = this.constant.modules.every(function(item:any) {
              return item.view == true;
        })
         this.constant.selectAllUpload = this.constant.modules.every(function(item:any) {
                  return item.upload == true;
            })
         this.constant.selectAllEdit = this.constant.modules.every(function(item:any) {
                  return item.edit == true;
            })
          }
      })
    
   }

  selectAll(event){
    const name = event.target.name;
    const value = event.target.checked;
    for (var i = 0; i < this.constant.modules.length; i++) {
        this.constant.modules[i][name] = value;
      }
  }


  saveRolePermission(form){
    console.log(form)
    let obj ={
     resortId:this.constant.resortId,
     divisionId:this.constant.divisionId,
     departmentId:this.constant.departmentId,
     designationId:this.constant.roleId,
     menu: this.constant.modules,
     web:this.constant.web,
     mobile:this.constant.mobile,
     userId: this.utilService.getUserData().userId
    }
    const data = this.constant;
    if(data.resortId && data.divisionId && data.departmentId && data.roleId){
    this.rolePermissionService.addRolePermission(obj).subscribe((result)=>{
      if(result.isSuccess){
        this.alertService.success(this.constant.messages.successMsg);
        this.clearForm(form);
      }
    })} 
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


  clearForm(formDir){
  this.constant.modules = RolePermissionVar.defaultModules;
  this.constant.resortId="";
  this.constant.divisionId="";
  this.constant.departmentId="";
  this.constant.roleId="";
  this.constant.web= false;
  this.constant.mobile= false;
  this.constant.selectAllView = false;
  this.constant.selectAllUpload=false;
  this.constant.selectAllEdit=false;
  formDir.submitted  = false;
  }

}
