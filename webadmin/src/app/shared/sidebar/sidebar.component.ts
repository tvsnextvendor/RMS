import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { UtilService ,PermissionService } from '../../services';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { CommonLabels } from '../../Constants/common-labels.var';
import { Permissions } from '../../Constants/role_permission' ;


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SideBarComponent implements OnInit {

  constructor(
    public router: Router,
    private utilservice: UtilService,
    private mScrollbarService: MalihuScrollbarService,
    public commonLabels:CommonLabels,
    private activatedRoute : ActivatedRoute,
    private permissionService :PermissionService) { }
   
   role;
   peerAdmin;
   networkAdmin;
   enableCreate = false;
   enableEdit = false;
   enableReport = false;
   enableShow = false;
   activeType ;
   tabType;
   currentUrl;
   roleId;
   employee;
   rolePermission;
   editViewEnable = false;

  ngOnInit() {
    let role = this.utilservice.getRole();
    let userData = this.utilservice.getUserData();
    // this.rolePermission = this.utilservice.getRolePermissions().length ? this.utilservice.getRolePermissions() : Permissions.user.menu;
    // if(role == 2){
    //   this.rolePermission = Permissions.peeradmin.menu;
    // }
    // console.log(this.rolePermission)
    if(this.permissionCheck('Quiz','edit') || this.permissionCheck('Training Class','edit') || this.permissionCheck('Course','edit') || this.permissionCheck('Notification','edit')){
      this.editViewEnable = true;
    }
    this.roleId = role;
    // console.log(this.roleId);
    if(role == 1){
      this.networkAdmin = true;
      this.peerAdmin = false;
      this.employee = false;
    }else if(role == 4){
      this.networkAdmin = false;
      this.peerAdmin = false;
      this.employee = true;
    }
    else{
      this.peerAdmin = true;
      this.networkAdmin =  false;
      this.employee = false;
    }
    this.activatedRoute.queryParams.subscribe(params=>{
      if(!Object.keys(params).length){
        this.activeType = this.router.url;
      } 
      else{
        this.activeType = params.type+params.tab;
      }
    })
  }
  ngDoCheck(){
    this.currentUrl = this.router.url;
  }

  ngAfterViewInit() {
    this.mScrollbarService.initScrollbar('#sidebar-wrapper', { axis: 'y', theme: 'minimal-dark' });
  }

  permissionCheck(modules,type){
    if(type == 'view'){
      // console.log(modules,this.permissionService.viewPermissionCheck(modules))
      return this.permissionService.viewPermissionCheck(modules);
    }
    else if(type == 'edit'){
        // console.log(modules,this.permissionService.editPermissionCheck(modules))
      return this.permissionService.editPermissionCheck(modules);
    }
  }

  dropDownEnable(type){
    switch(type){
      case 'dashboard':
        this.router.navigate(['/dashboard']);
        this.tabType = 'dashboard';
        this.enableCreate = false;
        this.enableEdit = false;
        this.enableReport = false;
        this.enableShow = false;  
        break;
      case 'create':
        this.enableCreate = !this.enableCreate;
        this.enableEdit = false;
        this.enableReport = false;
        this.enableShow = false;
        this.router.navigate(['/cmspage'],{queryParams : {type : 'create'}});
        this.tabType = 'create';
        break;
      case 'edit':
        this.enableCreate = false;
        this.enableEdit = !this.enableEdit;
        this.enableReport = false;
        this.enableShow = false;
        this.tabType = 'edit';
        this.router.navigate(['/cmspage'],{queryParams : {type : 'edit'}});
        break;
      case 'calendar':
        this.router.navigate(['/calendar']);
        this.tabType = 'calendar';
        this.enableCreate = false;
        this.enableEdit = false;
        this.enableReport = false;
        this.enableShow = false; 
        break;
      case 'report':
        this.enableCreate = false;
        this.enableEdit = false;
        this.enableReport = !this.enableReport;
        this.enableShow = false;  
        this.tabType = 'report'; 
        break;
      case 'show':  
        this.enableCreate = false;
        this.enableEdit = false;
        this.enableReport = false;
        this.enableShow = !this.enableShow;  
        this.tabType = 'show'; 
        break;
      case 'resource':
        this.router.navigate(['/resource/library']);
        this.tabType = 'resource';
        this.enableCreate = false;
        this.enableEdit = false;
        this.enableReport = false;
        this.enableShow = false; 
        break;
      case 'cms':
        this.router.navigate(['/cms-library']);
        this.tabType = 'cms';
        this.enableCreate = false;
        this.enableEdit = false;
        this.enableReport = false;
        this.enableShow = false; 
        break;
    }
  }

  pageRedirection(type,data){
    if(type == 'create' && data == 'quiz'){
      this.router.navigate(['/createQuiz'])
    }
    else{
      this.router.navigate(['/cms-library'],{queryParams:{type : type,tab : data}})
    } 
  }

  expandCheck(type){
    if(type == 'performance'){
      if(this.permissionCheck('Course Trend','view') || this.permissionCheck('Training Class Trend','view') || this.permissionCheck('Resort Details','view') || this.permissionCheck('Certification Trend','view') || this.permissionCheck('Expire Trend','view')){
        return true;
      }
      else{
        return false;
      }
    }
    if(type == "show"){
      if(this.permissionCheck('User Management','view') || this.permissionCheck('Approval Request','view') || this.permissionCheck('Forum','view') || this.permissionCheck('Certificates','view') || this.permissionCheck('Feedback','view')){
        return true;
      }
      else{
        return false;
      }
    }
    if(type == "edit"){
      if(this.permissionCheck('Course','view') || this.permissionCheck('Training Class','view') || this.permissionCheck('Video','view') || this.permissionCheck('Document','view') || this.permissionCheck('Quiz','view') || this.permissionCheck('Notification','view')){
        return true;
      }
      else{
        return false;
      }
    }
    if(type == "create"){
      if(this.permissionCheck('Course','edit') || this.permissionCheck('Training Class','edit') || this.permissionCheck('Quiz','edit') || this.permissionCheck('Notification','edit')){
        return true;

      }
      else{
        return false;
      }
    }
  }
}
