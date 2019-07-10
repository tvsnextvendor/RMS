import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { VideosTrendVar } from '../../Constants/videostrend.var';
import { ActivatedRoute, Params } from '@angular/router';
import { ExcelService, PDFService, CommonService, UtilService,BreadCrumbService,ResortService,UserService } from '../../services';
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
    resortList = [];
    divisionList = [];
    departmentList = [];
    empList = [];
    filterResort = null;
    filterDivision = null;
    filterDept = null;
    filterUser = null;
    roleId;
    enableFilter= false;

    constructor(private headerService: HeaderService,
        private excelService: ExcelService,
        private pdfService: PDFService,
        private activatedRoute: ActivatedRoute,
        public trendsVar: VideosTrendVar,
        private utilService: UtilService,
        public commonLabels:CommonLabels,
        private commonService: CommonService,
        private breadCrumbService :BreadCrumbService,
        private resortService : ResortService,
        private userService :UserService) {
        this.resortId = this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.trendsVar.videoId = params['id'];
        });
        this.trendsVar.url = API_URL.URLS;
    }

    ngOnInit() {
        this.headerService.setTitle({ title: this.commonLabels.titles.courseTrend, hidemodule: false });
        this.breadCrumbService.setTitle([]);
        this.roleId = this.utilService.getRole();
        this.resortId = this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
        this.filterResort = this.resortId;
        this.getEmployeeList('');
        this.getResortList();
    }

    getEmployeeList(filter){
        let query =  this.resortId  ? '?resortId='+this.resortId : '';
        if(filter){
            query = query+filter
        }
        this.commonService.getCourseEmployeeList(query, this.trendsVar.videoId).subscribe((result) => {
            if  (result && result.isSuccess) {
                this.trendsVar.employeeList = result.data.rows;
            }
        });
    }


    getResortList(){
        this.resortService.getResort().subscribe(item=>{
            if(item && item.isSuccess){
                this.resortList = item.data && item.data.rows.length ? item.data.rows : [];
                this.filterSelect(this.filterResort,'resort')
            } 
        })
    }

    filterSelect(value,type){
        if(type == "resort"){
            this.filterDivision =null;
            this.filterDept = null;
            this.filterUser = null;
            // console.log(value);
            this.resortService.getResortByParentId(this.filterResort).subscribe((result) => {
                if (result.isSuccess) {
                    this.divisionList = result.data.divisions;
                    let query = "&resortId="+this.filterResort;
                    this.getEmployeeList(query);
                }
            })

        }
        else if(type == "division"){
            this.filterDept = null;
            this.filterUser = null;
            // console.log(value);
            let obj = { 'divisionId': this.filterDivision };
            this.commonService.getDepartmentList(obj).subscribe((result) => {
                if (result.isSuccess) {
                    this.departmentList = result.data.rows;
                    let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision;
                    this.getEmployeeList(query);
                }
            })
        }
        else if(type == "dept"){
            this.filterUser = null;
            // console.log(value);
            let data = { 'departmentId': this.filterDept, 'createdBy': ' ' };
            this.roleId != 1 ? data.createdBy =  this.utilService.getUserData().userId : delete data.createdBy;
            this.userService.getUserByDivDept(data).subscribe(result => {
                if (result && result.data) {
                    this.empList = result.data;
                    let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+this.filterDept;
                    this.getEmployeeList(query);
                }

            })
        }
        else if(type == "emp"){
            // console.log(value);
            let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+this.filterDept+"&userId="+this.filterUser;
            this.getEmployeeList(query);
        }

    }

    resetFilter(){
        this.filterResort = null;
        this.filterDivision =null;
        this.filterDept = null;
        this.filterUser = null;
        this.getEmployeeList('');
    }
}
