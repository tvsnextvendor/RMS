import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../services/header.service';
import {HttpService} from '../services/http.service';
import {VideosTrendVar} from '../Constants/videostrend.var';
import { API_URL } from '../Constants/api_url';


@Component({
    selector: 'app-videostrend',
    templateUrl: './videostrend.component.html',
    styleUrls: ['./videostrend.component.css'],
})

export class VideosTrendComponent implements OnInit {

   constructor(private headerService:HeaderService,public trendsVar: VideosTrendVar ,private http: HttpService){
    this.trendsVar.url=API_URL.URLS;
   }
   
   selectedModule;
   
   ngOnInit(){
    this.headerService.setTitle({title:this.trendsVar.title, hidemodule:false});
    this.getVideosTrend('');
    this.getModuleList();
    this.trendsVar.pageLimitOptions = [5, 10, 25];
    this.trendsVar.pageLimit=[this.trendsVar.pageLimitOptions[0]];
   }

   ngDoCheck(){
    this.headerService.moduleSelection.subscribe(module => {
        this.selectedModule = module
     });    
    }


   onChangeModule(){
    this.getVideosTrend(this.trendsVar.moduleType);
   }

   getVideosTrend(moduleType) {
    //moduleId to get trend videos list based on selected module type.
    let moduleId = moduleType;
    this.http.get(this.trendsVar.url.getVideoTrendList).subscribe((data) => {
        this.trendsVar.videosTrend = data.VideoTrendList;
    });
    }

    onLimitChange(){
        console.log(this.trendsVar.pageLimit);
      }

    getModuleList(){
        this.http.get(this.trendsVar.url.getModuleList).subscribe((data) => {
          this.trendsVar.moduleList= data.ModuleList;
        });
    }

}
