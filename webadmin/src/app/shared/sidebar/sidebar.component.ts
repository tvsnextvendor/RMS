import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { UtilService  } from '../../services/util.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { CommonLabels } from '../../Constants/common-labels.var'


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
    private activatedRoute : ActivatedRoute) { }
   
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

  ngOnInit() {
       let role = this.utilservice.getRole();
       if(role == 1){
         this.networkAdmin = true;
         this.peerAdmin = false;
       }else{
         this.peerAdmin = true;
         this.networkAdmin =  false;
       }
       this.activatedRoute.queryParams.subscribe(params=>{
         this.activeType = params.type+params.tab;
       })
  }
  ngDoCheck(){
    this.currentUrl = this.router.url;
  }

  ngAfterViewInit() {
    this.mScrollbarService.initScrollbar('#sidebar-wrapper', { axis: 'y', theme: 'minimal-dark' });
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
        this.router.navigate(['/cmspage']);
        this.tabType = 'create';
        break;
      case 'edit':
        this.enableCreate = false;
        this.enableEdit = !this.enableEdit;
        this.enableReport = false;
        this.enableShow = false;
        this.tabType = 'edit';
        this.pageRedirection('edit','course');
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
    if(data == 'quiz'){
      this.router.navigate(['/createQuiz'])
    }
    else{
      this.router.navigate(['/cms-library'],{queryParams:{type : type,tab : data}})
    } 
  }
}
