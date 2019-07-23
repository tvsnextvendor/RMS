import { Component, OnInit } from '@angular/core';
import {DashboardVar} from '../Constants/dashboard.var';
import {HeaderService,BreadCrumbService} from '../services';
import {SocketService} from '../shared/socket.service';
import {UtilService} from '../services/util.service';
import { CommonLabels } from '../Constants/common-labels.var'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
 
  tabs = [];
  
  tabTitle = [];
  notificationCount = 0;
  selectedtab;

  constructor(private dashboardVar: DashboardVar,private utilService: UtilService ,private socketService:SocketService,private headerService: HeaderService,public commonLabels:CommonLabels,private breadCrumbService :BreadCrumbService) { }

  ngOnInit() {
  this.headerService.setTitle({title:this.commonLabels.titles.dashboard, hidemodule:false});
  this.breadCrumbService.setTitle([]);
  this.getNotification();
  const roleId = this.utilService.getRole();
  let user = this.utilService.getUserData();
  let parentId = user && user.ResortUserMappings.length && user.ResortUserMappings[0].Resort && user.ResortUserMappings[0].Resort.parentId ? user.ResortUserMappings[0].Resort.parentId : '';
    // this.tabTitle= [this.commonLabels.labels.summary,this.commonLabels.labels.resort];
    if(roleId === 3 || parentId){
      this.tabTitle= [this.commonLabels.labels.summary];
    }
    else{
      this.tabTitle= [this.commonLabels.labels.summary,this.commonLabels.labels.resort];
    }
    this.selectedtab = this.tabTitle[0];
    setInterval(() => {
      this.getNotification();
    }, 15000); 
  }

  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter(tab => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      // this.selectTab(this.tabs.first);
    }
  }

  getNotification(){
    let userData = this.utilService.getUserData();
    let socketObj = {
      userId: userData.userId
    }; 
    this.socketService.getNotification(socketObj).subscribe((data) => {
      this.notificationCount = data['unReadCount'];
    }); 
 }

  selectTab(tab: any) {
    // deactivate all tabs
    // this.tabs.toArray().forEach(tab => (tab.active = false));
    
    // activate the tab the user has clicked on.
    tab.active = true;
  }


}
