import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class RolePermissionVar {

permission = { };
selectAllView;
selectAllUpload;
selectAllEdit;
departmentList;
divisionList;
createdByList;
web=false;
mobile=false;
title= '';
resortList="";
roleList="";
divisionId="";
departmentId="";
roleId="";
userId="";
resortId="";
modules = [];
messages = {
	// successMsg : 'Roles & Permissions Saved Successfully'
}
labels = {
    //   selectDepartment : 'Department',
	//   selectDivision : 'Division',
	//   selectRoles:'Roles',
	//   selectUsers:'Users',
	//   selectResort:'Resort',
	//   menu:'Menu',
	//   view:'View',
	//   upload:'Upload',
	//   edit:'Edit / Delete',
	//   web: 'Web',
	//   mobile: 'Mobile'
	};

mandatoryText = {
//    resort : 'Resort is required',
//    division : 'Division is required',
//    department : 'Department is required',
//    roles : 'Role is required',
   users :'User is required'
};

btns ={
	
}

static readonly defaultModules = [{
	'moduleName': 'Dashboard',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'CMS Library',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'User Management',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Resort Management',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Approval Request',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Calendar',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Forum',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Certificates',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Subscription Model',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}];


static readonly mobileModules = [{
	'moduleName': 'Mobile_Dashboard',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}, {
	'moduleName': 'Mobile_Training',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}, {
	'moduleName': 'Mobile_Forum',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}, {
	'moduleName': 'Mobile_Accomplishments',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}, {
	'moduleName': 'Mobile_Training Schedule',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}, {
	'moduleName': 'Mobile_Feedback',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}, {
	'moduleName': 'Mobile_Settings',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}];


static readonly webAndMobile = [{
	'moduleName': 'Dashboard',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'CMS Library',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'User Management',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Resort Management',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Approval Request',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Calendar',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Forum',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Certificates',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Subscription Model',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Mobile_Dashboard',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}, {
	'moduleName': 'Mobile_Training',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}, {
	'moduleName': 'Mobile_Forum',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}, {
	'moduleName': 'Mobile_Accomplishments',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}, {
	'moduleName': 'Mobile_Training Schedule',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}, {
	'moduleName': 'Mobile_Feedback',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}, {
	'moduleName': 'Mobile_Settings',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}
];


}