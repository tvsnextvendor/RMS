import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../services/header.service';
import {HttpService} from '../services/http.service';
import {VideosTrendVar} from '../Constants/videostrend.var';

@Component({
    selector: 'app-videostrend',
    templateUrl: './videostrend.component.html',
    styleUrls: ['./videostrend.component.css'],
})

export class VideosTrendComponent implements OnInit {

   constructor(private headerService:HeaderService,private trendsVar: VideosTrendVar ,private http: HttpService){}

   ngOnInit(){
    this.headerService.setTitle('Videos Trend');
    this.getVideosTrend('');
    this.getModuleList();
    this.trendsVar.pageLimitOptions = [5, 10, 25];
    this.trendsVar.pageLimit=[this.trendsVar.pageLimitOptions[0]];
   }

   onChangeModule(){
    this.getVideosTrend(this.trendsVar.moduleType);
   }

   getVideosTrend(moduleType) {
    //moduleId to get trend videos list based on selected module type.
    let moduleId = moduleType;
    this.http.get('5c09210a2f0000c21f637c9c').subscribe((data) => {
        this.trendsVar.videosTrend = data.VideoTrendList;
    });
    }

    onLimitChange(){
        console.log(this.trendsVar.pageLimit);
      }

    getModuleList(){
        this.http.get('5c08da9b2f00004b00637a8c').subscribe((data) => {
          this.trendsVar.moduleList= data.ModuleList;
        });
    }

}
