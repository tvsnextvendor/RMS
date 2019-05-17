import { Component, OnInit } from '@angular/core';
import { RolePermissionVar } from '../Constants/rolepermission.var';
import { CommonService } from '../services/restservices/common.service';
import { RolePermissionService } from '../services/restservices/rolepermission.service';
import { UtilService } from '../services/util.service';
import { HeaderService } from '../services/header.service';
import { AlertService } from '../services/alert.service';
import { CommonLabels } from '../Constants/common-labels.var';


@Component({
  selector: 'app-rolepermission',
  templateUrl: './rolepermission.component.html',
  styleUrls: ['./rolepermission.component.css']
})
export class RolepermissionComponent implements OnInit {
  resortId;
  

  constructor(public constant: RolePermissionVar, private alertService: AlertService, private headerService: HeaderService, private commonService: CommonService, private utilService: UtilService, private rolePermissionService: RolePermissionService,public commonLabels : CommonLabels) {
  }

  ngOnInit() {
    this.constant.modules = RolePermissionVar.defaultModules;
    this.constant.selectAllView = false;
    this.constant.selectAllUpload = false;
    this.constant.selectAllEdit = false;

    let userData = this.utilService.getUserData();
    this.resortId = userData.ResortUserMappings ? userData.ResortUserMappings[0].Resort.resortId : '';
    this.getDropDownDetails('','');
    this.constant.resortList = [];
    this.getresortDetails();
  }
  getresortDetails(){
    let data = this.utilService.getUserData();
    this.commonService.getResortList(data.userId).subscribe((result) => {
      if(result && result.isSuccess){
        result.data && result.data.rows.forEach(item=>{
          if(item.resortId === this.resortId){
            this.constant.resortList.push(item)
          }
        });
      }
    });
  }

  getDropDownDetails(key,value){
    if(key === 'division'){
      this.commonService.getResortDivision(this.resortId).subscribe((result) => {
        if(result && result.isSuccess){
          this.constant.divisionList = result.data.length ? result.data[0].resortMapping.length && result.data[0].resortMapping : [];
          this.getRolePermission();
        }
      });
    }
    if(key === 'department'){
      let params = {"divisionId": value}
      this.commonService.getDepartmentList(params).subscribe((result) => {
        if(result && result.isSuccess){
          this.constant.departmentList = result.data && result.data.rows;
          this.getRolePermission();
        }
      });
    }
    else{
      this.commonService.getDesignationList(this.resortId).subscribe((result) => {
        if(result && result.isSuccess){
          this.constant.roleList = result.data && result.data.rows;
        }
      });
      this.commonService.getCreatedByDetails().subscribe(result=>{
        if(result && result.isSuccess){
          this.constant.createdByList = result.data  && result.data;
        }
      })
    }
  }

  getRolePermission() {
    let data: any = {};
    data.divisionId = this.constant.divisionId;
    data.departmentId = this.constant.departmentId;
    data.resortId = this.constant.resortId;
    data.designationId = this.constant.roleId;
    data.web = this.constant.web;
    data.mobile = this.constant.mobile;
    this.getCheckModules(data);
    this.rolePermissionService.getRolePermission(data).subscribe((result) => {
        if (result.isSuccess) {
          this.constant.modules = result.data.rows[0].userPermission;
        } else {
           // this.alertService.info(result.message);
            this.constant.modules.forEach(item=>{
              item.view = false;
              item.upload = false;
              item.edit = false;
            });
        }
        this.constant.selectAllView = this.constant.modules.every(function (item: any) {
          return item.view == true;
        });
        this.constant.selectAllUpload = this.constant.modules.every(function (item: any) {
          return item.upload == true;
        });
        this.constant.selectAllEdit = this.constant.modules.every(function (item: any) {
          return item.edit == true;
        });
      
    },(err) => {
      console.log(err);
      this.alertService.error(err.error.error);
      });
  }

  //Role Permission - Checklist Data
  getCheckModules(data) {
    if (data.mobile === true && !data.web) {
      this.constant.modules = RolePermissionVar.mobileModules;
    } else if (data.web === true && data.mobile === true) {
      this.constant.modules = RolePermissionVar.webAndMobile;
    } else {
      this.constant.modules = RolePermissionVar.defaultModules;
    }
  }

  selectAll(event) {
    const name = event.target.name;
    const value = event.target.checked;
    for (var i = 0; i < this.constant.modules.length; i++) {
      this.constant.modules[i][name] = value;
      if (name == 'view') {
        this.constant.selectAllView = value;
        } else if (name == 'upload') {
        this.constant.selectAllUpload = value;
        } else if (name == 'edit') {
        this.constant.selectAllEdit = value;
        } else {
        this.constant.selectAllView = value;
        this.constant.selectAllUpload = value;
        this.constant.selectAllEdit = value;
        }
    }
  }

  saveRolePermission(form) {
    console.log(form);
    let menu = [];
    let menuMobile = [];
    this.constant.modules.forEach(value => {
      if (!value.type || value.type == "web") {
      menu.push(value);
      } else {
      if (!value.type || value.type == "mobile")
      menuMobile.push(value);
      }
      });
    let obj = {
      resortId: this.constant.resortId,
      divisionId: this.constant.divisionId,
      departmentId: this.constant.departmentId,
      designationId: this.constant.roleId,
      menu: menu,
      menuMobile: menuMobile,
      web: this.constant.web,
      mobile: this.constant.mobile,
      userId : this.constant.userId,
      createdBy: this.utilService.getUserData().userId
    }
    const data = this.constant;
    if (data.resortId && data.divisionId && data.departmentId && data.roleId) {
      this.rolePermissionService.addRolePermission(obj).subscribe((result) => {
        if (result.isSuccess) {
          this.alertService.success(this.commonLabels.msgs.rolesuccessMsg);
          this.clearForm(form);
        }
      },(err) => {
        console.log(err);
        this.alertService.error(err.error.error);
        }
        )
    }
  }


  checkIfAllSelected(event, value, index) {
    const name = event.target.name;
    if (name == 'view') {
      this.constant.modules[index].view = !value;
      } else if (name == 'upload') {
      this.constant.modules[index].upload = !value;
      } else {
      this.constant.modules[index].edit = !value;
      }
    switch (name) {
      case 'view':
        this.constant.selectAllView = this.constant.modules.every(function (item: any) {
          return item.view == true;
        })
        break;
      case 'upload':
        this.constant.selectAllUpload = this.constant.modules.every(function (item: any) {
          return item.upload == true;
        })
        break;
      case 'edit':
        this.constant.selectAllEdit = this.constant.modules.every(function (item: any) {
          return item.edit == true;
        })
        break;
    }
  }


  clearForm(formDir) {
    formDir.submitted = false;
    formDir.reset(formDir);
    RolePermissionVar.defaultModules.forEach(item=>{
      item.view = false;
      item.upload = false;
      item.edit = false;
    });
    this.constant.selectAllView = false;
    this.constant.selectAllUpload = false;
    this.constant.selectAllEdit = false;
    this.constant.modules = RolePermissionVar.defaultModules;
    this.constant.resortId = "";
    this.constant.divisionId = "";
    this.constant.departmentId = "";
    this.constant.roleId = "";
    this.constant.web = false;
    this.constant.mobile = false;  
  }

}
