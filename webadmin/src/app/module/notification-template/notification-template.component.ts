import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HeaderService, UtilService, ResortService, CourseService, CommonService, UserService, BreadCrumbService } from '../../services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AlertService, PermissionService } from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var';

@Component({
  selector: 'app-notification-template',
  templateUrl: './notification-template.component.html',
  styleUrls: ['./notification-template.component.css']
})
export class NotificationTemplateComponent implements OnInit {

 notifyId;

  constructor(private breadCrumbService: BreadCrumbService, private alertService: AlertService, private headerService: HeaderService, private router: Router,
    public commonLabels: CommonLabels, private utilService: UtilService, private resortService: ResortService, private courseService: CourseService, private commonService: CommonService, private userService: UserService, private permissionService: PermissionService) { }

  ngOnInit() {
    this.headerService.setTitle({ title: 'Create', hidemodule: false });
    let data = this.notifyId ? [{ title: this.commonLabels.labels.edit, url: '/cms-library' }, { title: this.commonLabels.labels.editNotification, url: '' }] : [{ title: this.commonLabels.btns.create, url: '/cmspage' }, { title: this.commonLabels.btns.createNotification, url: '' }]
    this.breadCrumbService.setTitle(data);
  }


  notificationTypeUpdate(type) {
    this.router.navigate(['/cms-library'], { queryParams: { type: "create", tab: 'notification',notificationType : type  } });
  }


}
