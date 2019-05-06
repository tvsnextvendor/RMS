import { Component, OnInit } from '@angular/core';
import {SubscriptionVar} from '../Constants/subscription.var';
import {HeaderService} from '../services/header.service';
import { CommonLabels } from '../Constants/common-labels.var';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  constructor(public constant : SubscriptionVar, private headerService : HeaderService,public commonLabels:CommonLabels) { }

  ngOnInit(){

        console.log(this.constant.title);
        this.headerService.setTitle({title:this.commonLabels.titles.subscription, hidemodule:false});
  }

}
