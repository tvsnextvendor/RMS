import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common'; 
import {HttpService, HeaderService, UtilService, CommonService,BreadCrumbService} from '../services';
import {VideosTrendVar} from '../Constants/videostrend.var';
import { API_URL } from '../Constants/api_url';
import { CommonLabels } from '../Constants/common-labels.var'



@Component({
    selector: 'app-videostrend',
    templateUrl: './videostrend.component.html',
    styleUrls: ['./videostrend.component.css'],
})

export class VideosTrendComponent implements OnInit {

   constructor(private headerService: HeaderService,
    public trendsVar: VideosTrendVar ,
    private http: HttpService,
    private commonService: CommonService,
    private utilsService: UtilService,
    public location :Location,
    public commonLabels:CommonLabels,
    private breadCrumbService :BreadCrumbService
    ) {
    this.trendsVar.url = API_URL.URLS;
    this.resortId = this.utilsService.getUserData().ResortUserMappings[0].Resort.resortId;
    // console.log(this.resortId, 'reeee');
   }

   selectedModule;
   resortId;
   search;

   ngOnInit() {
    this.headerService.setTitle({title: this.commonLabels.titles.courseTrend, hidemodule: false});
    this.breadCrumbService.setTitle([]);
    this.getVideosTrend('');
    this.getModuleList();
    this.trendsVar.pageLimitOptions = [5, 10, 25];
    this.trendsVar.pageLimit = [this.trendsVar.pageLimitOptions[0]];
    
   }

   ngDoCheck() {
    this.headerService.moduleSelection.subscribe(module => {
        this.selectedModule = module;
     });
    }


   onChangeModule() {
    this.getVideosTrend(this.trendsVar.moduleType);
   }

   onChangeYear() {
    this.getModuleList();
   }

   onChangeMonth() {
    this.getModuleList();
   }

   getVideosTrend(moduleType) {
    // moduleId to get trend videos list based on selected module type.
    const moduleId = moduleType;
    this.http.get(this.trendsVar.url.getVideoTrendList).subscribe((data) => {
        this.trendsVar.videosTrend = data.VideoTrendList;
    });
    }

    onLimitChange() {
        console.log(this.trendsVar.pageLimit);
      }

    getModuleList() {
        // console.log(this.trendsVar.years, 'yeeeaa');
        // console.log(this.trendsVar.months);
        const courseTrendObj = {
            year : this.trendsVar.years,
            month : this.trendsVar.months,
        };
        let query = this.resortId ? '&resortId='+this.resortId : '';
        if(this.search){
            query = this.resortId ? '&resortId='+this.resortId+"&search="+this.search : '' ;
        }
        this.commonService.getCourseTrendList(courseTrendObj,query).subscribe((result) => {
          this.trendsVar.moduleList = result.data.rows;
        });
    }

    ngOnDestroy(){
        this.search = '';
    }
    resetSearch(){
        this.search = '';
        this.getModuleList();
    }

}
