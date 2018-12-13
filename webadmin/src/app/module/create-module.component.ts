import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../services/header.service';

@Component({
    selector: 'app-create-module',
    templateUrl: './create-module.component.html',
    styleUrls: ['./create-module.component.css'],
})

export class CreateModuleComponent implements OnInit {


   constructor(private headerService:HeaderService){}

   ngOnInit(){
    this.headerService.setTitle('Settings');
   }


 

}
