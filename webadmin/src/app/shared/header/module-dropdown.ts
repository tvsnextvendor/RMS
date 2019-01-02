
import { Component,Input,OnChanges,SimpleChange,OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import {HttpService} from '../../services/http.service';
import { HeaderService } from 'src/app/services/header.service';
import { API_URL } from 'src/app/Constants/api_url';


@Component({
	selector: 'module-dropdown',
	template: `<select id="moduleType" name="moduleType" required (change)="onChangeModule()" [(ngModel)]="moduleType" class="module-btn">     
    <option [ngValue]="null">Program</option>
    <option *ngFor="let module of moduleList"  value="{{module.id}}">{{module.name}}</option>
    </select>`
})
export class ModuleDropdownComponent implements OnInit{
    apiUrls;
    constructor(private http: HttpService, private headerService: HeaderService,private api_url:API_URL){
        this.apiUrls=API_URL.URLS;
    }
    moduleList;
    moduleType=null;

	ngOnInit() 
	{
      //get Program list
      this.http.get(this.apiUrls.getProgramList).subscribe((data) => {
            this.moduleList= data.programList;
      });    
    }
    
    onChangeModule(){
        this.headerService.selectModule(this.moduleType);
    }




}