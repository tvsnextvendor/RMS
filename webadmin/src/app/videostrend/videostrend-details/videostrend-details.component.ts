import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { VideosTrendVar } from '../../Constants/videostrend.var';
import { ActivatedRoute, Params } from '@angular/router';
import { ExcelService, PDFService, CommonService, UtilService } from '../../services';
import { API_URL } from 'src/app/Constants/api_url';
import { CommonLabels } from '../../Constants/common-labels.var'

@Component({
    selector: 'app-videostrend-details',
    templateUrl: './videostrend-details.component.html',
    styleUrls: ['./videostrend-details.component.css'],
})

export class VideosTrendDetailsComponent implements OnInit {
    resortId;
    CourseTrendList;
    constructor(private headerService: HeaderService,
        private excelService: ExcelService,
        private pdfService: PDFService,
        private activatedRoute: ActivatedRoute,
        public trendsVar: VideosTrendVar,
        private utilService: UtilService,
        public commonLabels:CommonLabels,
        private commonService: CommonService) {
        this.resortId = this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.trendsVar.videoId = params['id'];
        });
        this.trendsVar.url = API_URL.URLS;
    }

    ngOnInit() {
        this.headerService.setTitle({ title: this.commonLabels.titles.courseTrend, hidemodule: false });
        let query =  this.resortId  ? '?resortId='+this.resortId : '';
        this.commonService.getCourseEmployeeList(query, this.trendsVar.videoId).subscribe((result) => {
            if  (result && result.isSuccess) {
                this.trendsVar.employeeList = result.data.rows;
            }
        });
    }


}
