import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RolePermissionVar } from '../Constants/rolepermission.var';
import { CommonService } from '../services/restservices/common.service';
import { RolePermissionService } from '../services/restservices/rolepermission.service';
import { UtilService } from '../services/util.service';
import { HeaderService } from '../services/header.service';
import { AlertService } from '../services/alert.service';
import { CommonLabels } from '../Constants/common-labels.var';
import * as _ from 'lodash';


@Component({
  selector: 'app-rolepermission',
  templateUrl: './rolepermission.component.html',
  styleUrls: ['./rolepermission.component.css']
})
export class RolepermissionComponent implements OnInit {
  resortId;
  rolesPermissions;
  @Input() userIdInfo;
  @Input() userStatusInfo;
  @Input() viewUserRolePermission;


  constructor(public constant: RolePermissionVar, private alertService: AlertService, private headerService: HeaderService, private commonService: CommonService, private utilService: UtilService, private rolePermissionService: RolePermissionService, public commonLabels: CommonLabels) {
  }

  ngOnChanges(){
    if (this.userIdInfo) {
      this.getData();
    } 
    else{
      this.constant.modules.forEach(item => {
        item.view = false;
        item.upload = false;
        item.edit = false;
        this.constant.selectAllView = false;
        this.constant.selectAllUpload = false;
        this.constant.selectAllEdit = false;
      });
      this.rolesPermissions = [];
    }
  }

  ngOnInit() {
    this.clearSelectFields(null);
    this.constant.modules = RolePermissionVar.defaultModules;
    this.constant.selectAllView = false;
    this.constant.selectAllUpload = false;
    this.constant.selectAllEdit = false;

    let userData = this.utilService.getUserData();
    this.resortId = userData.ResortUserMappings ? userData.ResortUserMappings[0].Resort.resortId : '';
    this.getDivisions(this.resortId);
    this.getRoles(this.resortId);
    this.constant.resortList = [];
    this.getresortDetails();
    // console.log("this.userIdInfo");

    // console.log(this.userIdInfo);
    //debugger;
    if (this.userIdInfo) {
      // this.getData();
    } else {
      this.constant.modules.forEach(item => {
        item.view = false;
        item.upload = false;
        item.edit = false;
      });
      this.rolesPermissions = [];
    }
  }
  getData() {
    let query = "?userId="+this.userIdInfo;
    query = this.userStatusInfo && this.userStatusInfo == 'web' ? query+"&web=1" : (this.userStatusInfo == 'mobile' ? query+"&mobile=1" : query)
    this.rolePermissionService.getRolePermissions(query).subscribe((result) => {
      if (result && result.isSuccess) {
        this.rolesPermissions = result.data && result.data.rows;
        const resultRolePermissions = this.getObject(this.rolesPermissions, []);
       // console.log(resultRolePermissions);
        let permissions = [];
        for(let i in resultRolePermissions){
            //  console.log(resultRolePermissions);
            //  console.log(resultRolePermissions[i]);
            //  console.log(i);
             if(i != 'undefined'){
              permissions.push(resultRolePermissions[i]);
             }
        }

      
        // console.log(resultRolePermissions);
        // console.log(permissions);
        // debugger;
        this.constant.modules = permissions;
      } else {
        this.constant.modules.forEach(item => {
          item.view = false;
          item.upload = false;
          item.edit = false;
        });
        this.rolesPermissions = [];
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
      // console.log(this.rolesPermissions);
    });
  }
  getresortDetails() {
    this.commonService.getParentChildResorts(this.resortId).subscribe((result) => {
      if (result && result.isSuccess) {
        result.data && result.data.rows.forEach(item => {
          this.constant.resortList.push(item)
        });
      }
    });
  }
  getDivisions(resortId) {
    this.commonService.getResortByParentId(resortId).subscribe((result) => {
      if (result && result.isSuccess) {
        this.constant.divisionList = result.data ? result.data.divisions : [];
      } else {
        this.constant.divisionList = [];
      }
    });
    this.getRoles(resortId);
  }
  getDepartments(divisionId) {
    let params = { "divisionId": divisionId }
    this.commonService.getDepartmentList(params).subscribe((result) => {
      if (result && result.isSuccess) {
        this.constant.departmentList = result.data && result.data.rows;
        this.getRolePermission();
      } else {
        this.constant.departmentList = [];
      }
    });
  }
  getRoles(resortId) {
    this.commonService.getDesignationList(resortId).subscribe((result) => {
      if (result && result.isSuccess) {
        this.constant.roleList = result.data && result.data.rows;
      } else {
        this.constant.roleList = [];
      }
    });
  }

  getRolePermission() {
    let data: any = {};
    data.divisionId = (this.constant.divisionId) ? this.constant.divisionId : "";
    data.departmentId = (this.constant.departmentId) ? this.constant.departmentId : "";
    data.resortId = (this.constant.resortId) ? this.constant.resortId : "";
    data.designationId = (this.constant.roleId) ? this.constant.roleId : "";
    data.web = this.constant.web;
    data.mobile = this.constant.mobile;
    this.getCheckModules(data);
    this.rolePermissionService.getRolePermission(data).subscribe((result) => {
      if (result.isSuccess) {
        this.constant.modules = result.data.rows[0].userPermission;
      } else {
        this.constant.modules.forEach(item => {
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
    }, (err) => {
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
    if(this.constant.modules.length == 1 && (name == 'view' || name == 'edit')){
      name == 'view'  ? this.alertService.warn('Sorry unable to give view permision for mobile settings') : this.alertService.warn('Sorry unable to give edit permision for mobile settings')
    }
    else{
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
    this.constant.modules.forEach((item,i)=>{
      if(item.moduleName ==  "Employee Content Upload" && name == 'view'){
        this.constant.modules[i].view = false;
        this.constant.selectAllView = false;
        this.alertService.warn('Sorry unable to give view permision for mobile settings')
      }
      else if(item.moduleName ==  "Employee Content Upload" && name == 'edit'){
        this.constant.modules[i].edit = false;
        this.constant.selectAllEdit = false;
        this.alertService.warn('Sorry unable to give edit permision for mobile settings')
      }
    })
  }

  saveRolePermission(form) {

    // console.log(this.constant.web);
    // console.log(this.constant.mobile);

    // console.log(form);
    // debugger;
    //if(this.constant.web && this.constant.mobile){
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
        // createdBy: this.utilService.getUserData().userId
      }
      const data = this.constant;
      if (data.resortId && data.divisionId && data.departmentId && data.roleId) {
        this.rolePermissionService.addRolePermission(obj).subscribe((result) => {
          if (result.isSuccess) {
            this.alertService.success(this.commonLabels.msgs.rolesuccessMsg);
            this.clearForm(form);
          }
        }, (err) => {
          this.alertService.error(err.error.error);
        }
        )
      }

    // }else{
    //   this.alertService.error("web & mobile both permissions are required");
    // }
    

   
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
    this.constant.selectAllView = false;
    this.constant.selectAllUpload = false;
    this.constant.selectAllEdit = false;
    this.constant.modules = RolePermissionVar.defaultModules;
    this.clearSelectFields(null);
    this.constant.web = false;
    this.constant.mobile = false;
    RolePermissionVar.defaultModules.forEach(item => {
      item.view = false;
      item.upload = false;
      item.edit = false;
    });
  }
  clearSelectFields(val) {
    this.constant.resortId = val;
    this.constant.divisionId = val;
    this.constant.departmentId = val;
    this.constant.roleId = val;
  }

  getObject(theObject, userpermissions) {
    var result = null;
    var key = 'moduleName';
    if (theObject instanceof Array) {
      for (var i = 0; i < theObject.length; i++) {
        if (userpermissions[theObject[i].moduleName] == undefined) {
          userpermissions[theObject[i].moduleName] = [];
          userpermissions[theObject[i].moduleName] = theObject[i];
        }
        result = this.getObject(theObject[i], userpermissions);
      }
    }
    else {
      let moduleName = theObject.moduleName;
      for (var prop in theObject) {
        const data = ["moduleName", "view", "upload", "edit", "delete"];

        let found = data.includes(prop);
        if (found) {
          if (theObject[prop] == true || theObject[prop] == false) {
            userpermissions[moduleName][prop] = (userpermissions[moduleName][prop] == true) ? true : theObject[prop];
          }
        }
        if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
          result = this.getObject(theObject[prop], userpermissions);
        }
      }
    }
    return userpermissions;
  }


 

}
