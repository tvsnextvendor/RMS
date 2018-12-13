
import { Component,Input,OnChanges,SimpleChange,OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import {HttpService} from '../../services/http.service';
import { HeaderService } from 'src/app/services/header.service';


@Component({
	selector: 'module-dropdown',
	template: `<select id="moduleType" name="moduleType" required (change)="onChangeModule()" [(ngModel)]="moduleType" class="module-btn">     
    <option [ngValue]="null">Module</option>
    <option *ngFor="let module of moduleList"  value="{{module.moduleId}}">{{module.moduleName}}</option>
    </select>`
})
export class ModuleDropdownComponent implements OnInit{

    constructor(private http: HttpService, private headerService: HeaderService){}
    moduleList;
    moduleType=null;

	ngOnInit() 
	{
      //get Module list
      this.http.get('5c08da9b2f00004b00637a8c').subscribe((data) => {
            this.moduleList= data.ModuleList;
      });    
    }
    
    onChangeModule(){
        this.headerService.selectModule(this.moduleType);
    }




}