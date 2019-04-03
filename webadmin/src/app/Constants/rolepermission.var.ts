import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class RolePermissionVar {

permission = { };
selectAllView;
selectAllUpload;
selectAllEdit;
departmentList;
divisionList;
web=false;
mobile=false;
title= 'Roles & Permissions';
resortList="";
roleList="";
divisionId="";
departmentId="";
roleId="";
userId;
resortId="";
modules = [{
	'moduleName': 'User Management',
	'view': false,
	'upload': false,
	'edit': false
}, {
	'moduleName': 'Resort Management',
	'view': false,
	'upload': false,
	'edit': false
},{
	'moduleName': 'Dashboard',
	'view': false,
	'upload': false,
	'edit': false
},{
	'moduleName': 'Calendar',
	'view': false,
	'upload': false,
	'edit': false
},{
	'moduleName': 'Training',
	'view': false,
	'upload': false,
	'edit': false
},{
	'moduleName': 'Forum',
	'view': false,
	'upload': false,
	'edit': false
}];
messages = {
	successMsg : 'Roles & Permissions Saved Successfully'
}
labels = {
      selectDepartment : 'Department',
	  selectDivision : 'Division',
	  selectRoles:'Roles',
	  selectResort:'Resort',
	  menu:'Menu',
	  view:'View',
	  upload:'Upload',
	  edit:'Edit / Delete',
	  web: 'Web',
	  mobile: 'Mobile'
    };
btns ={
	save : 'Save',
	cancel: 'Cancel'
}
defaultModules = [{
	'moduleName': 'User Management',
	'view': false,
	'upload': false,
	'edit': false
}, {
	'moduleName': 'Resort Management',
	'view': false,
	'upload': false,
	'edit': false
},{
	'moduleName': 'Dashboard',
	'view': false,
	'upload': false,
	'edit': false
},{
	'moduleName': 'Calendar',
	'view': false,
	'upload': false,
	'edit': false
},{
	'moduleName': 'Training',
	'view': false,
	'upload': false,
	'edit': false
},{
	'moduleName': 'Forum',
	'view': false,
	'upload': false,
	'edit': false
}]
    
}