import { Component, OnInit } from '@angular/core';
import {SubscriptionVar} from '../Constants/subscription.var';
import {HeaderService} from '../services/header.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  constructor(public constant : SubscriptionVar, private headerService : HeaderService) { }

  ngOnInit(){

        console.log(this.constant.title);
        this.headerService.setTitle({title:this.constant.title, hidemodule:false});
  }

}
