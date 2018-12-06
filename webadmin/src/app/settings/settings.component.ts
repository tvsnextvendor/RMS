import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../services/header.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
})

export class SettingsComponent implements OnInit {


    settings: any = {
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
    };

   constructor(private headerService:HeaderService){}

   ngOnInit(){
    this.headerService.setTitle('Settings');
   }


   updatePwd(){
    console.log(this.settings);
   }

}
