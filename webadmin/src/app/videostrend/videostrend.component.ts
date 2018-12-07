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


    videosTrend;
   constructor(private headerService:HeaderService,private trendsVar: VideosTrendVar ,private http: HttpService){}

   ngOnInit(){
    this.headerService.setTitle('Videos Trend');
    this.getVideosTrend();

   }

   getVideosTrend() {
    this.http.get('5c09210a2f0000c21f637c9c').subscribe((data) => {
        this.videosTrend = data.VideoTrendList;
    });
    }

}
