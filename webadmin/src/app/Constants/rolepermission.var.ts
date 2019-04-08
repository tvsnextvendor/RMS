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

mandatoryText = {
   resort : 'Resort is required',
   division : 'Division is required',
   department : 'Department is required',
   roles : 'Role is required',
};

btns ={
	save : 'Save',
	cancel: 'Cancel'
}
static readonly defaultModules = [{
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