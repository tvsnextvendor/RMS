import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent implements OnInit {

  constructor(private headerService: HeaderService) { 
    // this.subscriptionVar.url = API_URL.URLS;
  }

  ngOnInit() {
    // this.subscriptionVar.title = "Resort Management";
    this.headerService.setTitle({ title: 'Subscription List', hidemodule: false });
  }

}
