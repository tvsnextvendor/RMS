import { Component, OnInit } from '@angular/core';
import {BreadCrumbService } from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var';

@Component({
  selector: 'app-notification-tab',
  templateUrl: './notification-tab.component.html',
  styleUrls: ['./notification-tab.component.css']
})
export class NotificationTabComponent implements OnInit {

  constructor(private breadCrumbService : BreadCrumbService,public commonLabels :CommonLabels ) { }

  ngOnInit() {
    let data = [{title : this.commonLabels.labels.cmsLibrary,url:'/cms-library'},{title : this.commonLabels.labels.notification,url:''}]
    this.breadCrumbService.setTitle(data)
  }

}
