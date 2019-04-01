import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../services/header.service';
import {Router} from '@angular/router';
import {ToastrService } from 'ngx-toastr';
import { AlertService } from '../services/alert.service';

@Component({
    selector: 'app-resort',
    templateUrl: './resort.component.html',
})

export class ResortComponent implements OnInit {
   constructor(private alertService: AlertService,private headerService:HeaderService,private toastr:ToastrService,private router:Router){

   }
    
   ngOnInit(){
    //this.headerService.setTitle({title:this.profVar.title, hidemodule:false});
   
   }
  
   

}
