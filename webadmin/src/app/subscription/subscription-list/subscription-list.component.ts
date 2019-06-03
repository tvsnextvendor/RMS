import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService,BreadCrumbService } from '../../services';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent implements OnInit {

  constructor(private headerService: HeaderService,private breadCrumbService :BreadCrumbService) { 
    // this.subscriptionVar.url = API_URL.URLS;
  }

  ngOnInit() {
    // this.subscriptionVar.title = "Resort Management";
    this.headerService.setTitle({ title: 'Subscription List', hidemodule: false });
    this.breadCrumbService.setTitle([]);
  }

}
