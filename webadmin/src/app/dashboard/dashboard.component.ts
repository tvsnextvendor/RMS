import { Component, OnInit } from '@angular/core';
import {DashboardVar} from '../Constants/dashboard.var';
import {HeaderService} from '../services/header.service';
import {UtilService} from '../services/util.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
 
  tabs = [];
  
  tabTitle = [];
  selectedtab ;

  constructor(private dashboardVar: DashboardVar,private utilService: UtilService ,private headerService: HeaderService) { }

  ngOnInit() {
  this.headerService.setTitle({title:this.dashboardVar.title, hidemodule:false});
  const roleId = this.utilService.getRole()
    if(roleId === 1){
        this.tabTitle= ['Summary','Resort'];
    }
    else if(roleId === 2){
      this.tabTitle= ['Summary'];
    }
    this.selectedtab = this.tabTitle[0];
  
  // console.log(data,user.roleId)
  }

  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter(tab => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      // this.selectTab(this.tabs.first);
    }
  }

  
  selectTab(tab: any) {
    // deactivate all tabs
    // this.tabs.toArray().forEach(tab => (tab.active = false));
    
    // activate the tab the user has clicked on.
    tab.active = true;
  }


}
