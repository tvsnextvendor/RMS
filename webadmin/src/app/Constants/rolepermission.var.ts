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
resortList=[];
roleList=[];
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
	'moduleName': 'Resource Library',
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
	'moduleName': 'Site Management',
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
	'moduleName': 'Schedule',
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
	'moduleName': 'Course / Training Class / Quiz',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
},
//  {
// 	'moduleName': 'Training Class',
// 	'view': false,
// 	'upload': false,
// 	'edit': false,
// 	'type': "web"
// }, {
// 	'moduleName': 'Quiz',
// 	'view': false,
// 	'upload': false,
// 	'edit': false,
// 	'type': "web"}
 {
	'moduleName': 'Notification',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Feedback',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Course Trend',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
},{
	'moduleName': 'Training Class Trend',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
},{
	'moduleName': 'Notification Trend',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
},{
	'moduleName': 'Expire Trend',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Resort Details',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}, {
	'moduleName': 'Certification Trend',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "web"
}];


static readonly mobileModules = [{
	'moduleName': 'Employee Content Upload',
	'view': false,
	'upload': false,
	'edit': false,
	'type': "mobile"
}
// {
// 	'moduleName': 'Mobile_Training',
// 	'view': false,
// 	'upload': false,
// 	'edit': false,
// 	'type': "mobile"
// }, {
// 	'moduleName': 'Mobile_Forum',
// 	'view': false,
// 	'upload': false,
// 	'edit': false,
// 	'type': "mobile"
// }, {
// 	'moduleName': 'Mobile_Accomplishments',
// 	'view': false,
// 	'upload': false,
// 	'edit': false,
// 	'type': "mobile"
// }, {
// 	'moduleName': 'Mobile_Training Schedule',
// 	'view': false,
// 	'upload': false,
// 	'edit': false,
// 	'type': "mobile"
// }, {
// 	'moduleName': 'Mobile_Feedback',
// 	'view': false,
// 	'upload': false,
// 	'edit': false,
// 	'type': "mobile"
// }, {
// 	'moduleName': 'Mobile_Settings',
// 	'view': false,
// 	'upload': false,
// 	'edit': false,
// 	'type': "mobile"
// }
];


static readonly webAndMobile = [{
                                   'moduleName': 'Dashboard',
                                   'view': false,
                                   'upload': false,
                                   'edit': false,
                                   'type': "web"
                               }, {
                                   'moduleName': 'Resource Library',
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
                                   'moduleName': 'Site Management',
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
                                   'moduleName': 'Schedule',
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
                                   'moduleName': 'Course',
                                   'view': false,
                                   'upload': false,
                                   'edit': false,
                                   'type': "web"
                               }, {
                                   'moduleName': 'Training Class',
                                   'view': false,
                                   'upload': false,
                                   'edit': false,
                                   'type': "web"
                               }, {
                                   'moduleName': 'Quiz',
                                   'view': false,
                                   'upload': false,
                                   'edit': false,
                                   'type': "web"
                               }, {
                                   'moduleName': 'Notification',
                                   'view': false,
                                   'upload': false,
                                   'edit': false,
                                   'type': "web"
                               }, {
                                   'moduleName': 'Feedback',
                                   'view': false,
                                   'upload': false,
                                   'edit': false,
                                   'type': "web"
                               }, {
                                   'moduleName': 'Course Trend',
                                   'view': false,
                                   'upload': false,
                                   'edit': false,
                                   'type': "web"
                               },{
								'moduleName': 'Training Class Trend',
								'view': false,
								'upload': false,
								'edit': false,
								'type': "web"
								},{
									'moduleName': 'Notification Trend',
									'view': false,
									'upload': false,
									'edit': false,
									'type': "web"
								},{
									'moduleName': 'Expire Trend',
									'view': false,
									'upload': false,
									'edit': false,
									'type': "web"
								}, {
                                   'moduleName': 'Resort Details',
                                   'view': false,
                                   'upload': false,
                                   'edit': false,
                                   'type': "web"
                               }, {
                                   'moduleName': 'Certification Trend',
                                   'view': false,
                                   'upload': false,
                                   'edit': false,
                                   'type': "web"
                               },{
									'moduleName': 'Employee Content Upload',
									'view': false,
									'upload': false,
									'edit': false,
									'type': "mobile"
                             }];


}