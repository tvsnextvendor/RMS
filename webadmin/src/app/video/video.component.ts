import { Component, OnInit } from '@angular/core';
import { VideoVar } from '../Constants/video.var';
import { HttpService } from '../services/http.service';
import { HeaderService } from '../services/header.service';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.css'],
})
export class VideoComponent implements OnInit {
    courses:any=[];
    constructor(public videoVar: VideoVar, public http: HttpService, private headerService: HeaderService) { }

    ngOnInit() {
        this.getCourses();
        this.headerService.setTitle('Videos');
    }
    getCourses() {
        this.http.get('5c0660b4330000bb4ce81634').subscribe((data) => {
            this.courses = data;
            console.log(data);
        });
    }
}