import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../services/header.service';
import { HttpService } from '../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from '../Constants/api_url';
import { CommonLabels} from '../Constants/common-labels.var'
@Component({
  selector: 'app-approvalrequests',
  templateUrl: './approvalrequests.component.html',
  styleUrls: ['./approvalrequests.component.css']
})
export class ApprovalrequestsComponent implements OnInit {

  constructor(private headerService:HeaderService,public commonLabels : CommonLabels) { }

  ngOnInit() {
    this.headerService.setTitle({title:'Approval Request', hidemodule:false});
  }

}
