import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,Params } from '@angular/router';
import {HeaderService,BreadCrumbService, PermissionService} from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var'
import {SideBarService} from '../../../../src/app/shared/sidebar/sidebar.service'

@Component({
  selector: 'app-cms-page',
  templateUrl: './cms-page.component.html',
  styleUrls: ['./cms-page.component.css']
})
export class CmsPageComponent implements OnInit {
  urlType;
  constructor(private breadCrumbService :BreadCrumbService,private sidebar: SideBarService,private route: Router,private activatedRoute: ActivatedRoute,private headerService :HeaderService,public commonLabels : CommonLabels, private permissionService:PermissionService) { }

  ngOnInit() {
    this.breadCrumbService.setTitle([]);
    this.activatedRoute.queryParams.subscribe(params=>{
       this.urlType = params.type ? params.type  : 'create';
       let path = window.location.pathname;
       let data = params.type == 'create' ? 'Create' : params.type == 'edit' ? 'Edit' : path == '/cms-library' ? 'Edit' : 'Create';
       this.headerService.setTitle({title:data, hidemodule:false});
    })
  }


   permissionCheck(modules,type){
    if(type == 'view'){
      // console.log(this.permissionService.viewPermissionCheck(modules), "view" , modules);
      return this.permissionService.viewPermissionCheck(modules);
    }
    else if(type == 'edit'){
      // console.log(this.permissionService.editPermissionCheck(modules), "edit", modules);      
      return this.permissionService.editPermissionCheck(modules);
    }
  }

  pageRedirection(type,data){
    // this.activeType = type+data;
    console.log(type+'-----'+data);
    this.sidebar.activeType=type+data;
    if(type == 'create' && data == 'quiz'){
      this.route.navigate(['/createQuiz'])
    }else if(type == 'create' && data == 'notification'){
      this.route.navigate(['/notification/template']);
    }else{
      this.route.navigate(['/cms-library'],{queryParams:{type : type,tab : data}})
    }
  }

}
