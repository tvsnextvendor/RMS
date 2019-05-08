import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { HttpService } from '../../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from '../../Constants/api_url';
import { CommonLabels } from '../../Constants/common-labels.var'

@Component({
  selector: 'app-approvalrequestsdetails',
  templateUrl: './approvalrequestsdetails.component.html',
  styleUrls: ['./approvalrequestsdetails.component.css']
})
export class ApprovalrequestsdetailsComponent implements OnInit {

  constructor( public commonLabels:CommonLabels) { }

  ngOnInit() {
  }

}
