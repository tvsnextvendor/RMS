import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../services/header.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit {


   constructor(private headerService:HeaderService){}

   ngOnInit(){
    this.headerService.setTitle('Profile');
   }

}
