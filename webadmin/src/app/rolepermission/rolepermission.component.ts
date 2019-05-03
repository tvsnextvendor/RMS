import { Component, OnInit } from '@angular/core';
import { RolePermissionVar } from '../Constants/rolepermission.var';
import { CommonService } from '../services/restservices/common.service';
import { RolePermissionService } from '../services/restservices/rolepermission.service';
import { UtilService } from '../services/util.service';
import { HeaderService } from '../services/header.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-rolepermission',
  templateUrl: './rolepermission.component.html',
  styleUrls: ['./rolepermission.component.css']
})
export class RolepermissionComponent implements OnInit {

  constructor(public constant: RolePermissionVar, private alertService: AlertService, private headerService: HeaderService, private commonService: CommonService, private utilService: UtilService, private rolePermissionService: RolePermissionService) {
  }

  ngOnInit() {
    this.constant.modules = RolePermissionVar.defaultModules;
    this.constant.selectAllView = false;
    this.constant.selectAllUpload = false;
    this.constant.selectAllEdit = false;
    // this.headerService.setTitle({title:this.constant.title, hidemodule:false});
    this.getDropDownDetails();
  }

  getDropDownDetails(){
    this.commonService.getDivisionList().subscribe((result) => {
      if(result && result.isSuccess){
        this.constant.divisionList = result.data.length && result.data.rows;
      }
    })
    this.commonService.getDepartmentList('').subscribe((result) => {
      if(result && result.isSuccess){
        this.constant.departmentList = result.data.length && result.data.rows;
      }
    })
    this.commonService.getDesignationList('').subscribe((result) => {
      if(result && result.isSuccess){
        this.constant.roleList = result.data.length && result.data.rows;
      }
    })
    this.commonService.getResortList().subscribe((result) => {
      if(result && result.isSuccess){
        this.constant.resortList = result.data.length && result.data.rows;
      }
    })
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
            this.alertService.info(result.message);
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
      userId: this.utilService.getUserData().userId
    }
    const data = this.constant;
    if (data.resortId && data.divisionId && data.departmentId && data.roleId) {
      this.rolePermissionService.addRolePermission(obj).subscribe((result) => {
        if (result.isSuccess) {
          this.alertService.success(this.constant.messages.successMsg);
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
