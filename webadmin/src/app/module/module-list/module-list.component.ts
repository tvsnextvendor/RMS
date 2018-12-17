import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {HttpService} from '../../services/http.service';
import { ToastrService } from 'ngx-toastr';
import {ModuleVar } from '../../Constants/module.var';
import { API_URL } from '../../Constants/api_url';

@Component({
    selector: 'app-module-list',
    templateUrl: './module-list.component.html',
    styleUrls: ['./module-list.component.css'],
})

export class ModuleListComponent implements OnInit {
 
    constructor(private http: HttpService,private moduleVar: ModuleVar,private toastr:ToastrService,private headerService:HeaderService){
        this.moduleVar.url=API_URL.URLS;
    }
    
    ngOnInit(){
    this.headerService.setTitle({title:this.moduleVar.title, hidemodule:false});
    this.http.get(this.moduleVar.url.moduleCourseList).subscribe((data) => {
        this.moduleVar.moduleList = data.moduleList;
    });
   }

  customOptions: any = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      307: {
        items: 2
      },
      614: {
        items: 3
      },
      921: {
        items: 4
      }
    },
    nav: true,
    navText: ['<', '>']
  }

  //To change Activate/Deactive module status.
  statusUpdate(moduleName,status){
    let statusName = status ? " is Activated" : " is Deativated"
    this.toastr.success(moduleName + statusName);
  }

}
