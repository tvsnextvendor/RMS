import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../services/header.service';

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css'],
})

export class GroupComponent implements OnInit {

   constructor(private headerService:HeaderService){}

   ngOnInit(){
    this.headerService.setTitle('Groups');

   }

}
