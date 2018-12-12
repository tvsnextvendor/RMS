import { Component, OnInit } from '@angular/core';
import {DashboardVar} from '../Constants/dashboard.var';
import {HeaderService} from '../services/header.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
 
  tabs = [];
  title:string = "Dashboard";
  hidemodule=0;

  constructor(private dashboardVar: DashboardVar,private headerService: HeaderService) { }

  tabTitle: string[] = ['Employee','Resort'];
  selectedtab = this.tabTitle[0];

  ngOnInit() {
  this.headerService.setTitle({title:this.title, hidemodule:this.hidemodule});
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
