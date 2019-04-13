import { Component, OnInit ,Input,Output, EventEmitter} from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BatchVar } from '../../Constants/batch.var';
import { ModuleVar } from '../../Constants/module.var';
import { HttpService } from 'src/app/services/http.service';
import { API_URL } from '../../Constants/api_url';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import * as moment from 'moment';

@Component({
    selector: 'app-add-notification',
    templateUrl: './add-notification.component.html',
    styleUrls: ['./add-notification.component.css']
})

export class AddNotificationComponent implements OnInit {
    @Output() someEvent = new EventEmitter<string>();
    @Input() notificationType;
    durationValue = '1';
    reminder;
    showToDate = false;
    showFromDate = false;
    dateError = false;
    labels;
    selectedCourses;
    selectedTrainingClass;
    selectedTopics;
    selectedEmployee;
    file;
    fileName;
    description;
    uploadFileName;
    constructor(private alertService: AlertService, private headerService: HeaderService,public moduleVar: ModuleVar, private datePipe: DatePipe, private activatedRoute: ActivatedRoute, private http: HttpService, public batchVar: BatchVar, private toastr: ToastrService, private router: Router) {
        this.batchVar.url = API_URL.URLS;
        this.labels = moduleVar.labels;
    }

    ngOnInit() {
        let startDate = localStorage.getItem('BatchStartDate');
        this.batchVar.batchFrom = new Date(startDate);
    }

    selectFilter(data) {
        let startDate = localStorage.getItem('BatchStartDate');
        return data.value >= new Date(startDate);
    }

    errorCheck() {
        let now = moment(this.batchVar.batchFrom);
        let end = moment(this.batchVar.batchTo);
        let duration = moment.duration(end.diff(now));
        var days = duration.asDays();
        if (days < 0) {
            this.dateError = true;
        }
        else {
            this.dateError = false;
        }
    }


    splitDate(date) {
        const newDate = new Date(date);
        const y = newDate.getFullYear();
        const d = newDate.getDate();
        const month = newDate.getMonth();
        const h = newDate.getHours();
        const m = newDate.getMinutes();
        return new Date(y, month, d, h, m);
    }

    fromDateChange(date) {
        //  let fromDate=date.toISOString();
        this.batchVar.batchFrom = date;
    }
    dateInputClick() {
        this.showToDate = !this.showToDate;
    }
    fromDateInputClick() {
        this.showFromDate = !this.showFromDate;
    }

    toDateChange(date) {
        this.batchVar.batchTo = date;
    }

    autoHide(data) {
        let value = data[1];
        if (value === 'dl-abdtp-date-button') {
            this.showToDate = false;
            this.showFromDate = false;
        }
    }
    //submit batch
    addBatch(form) {

        this.batchVar.empValidate = this.batchVar.employeeId ? false : true;
        let data = {}
        console.log(
            this.file,
            this.fileName,
            this.description,
            this.batchVar.batchFrom,
            this.batchVar.batchTo)
        // this.batchVar.dategreater = Date.parse(this.batchVar.batchFrom) >= Date.parse(this.batchVar.batchTo) ? true : false;
        // let toastrMsg = this.batchVar.batchId ? this.batchVar.batchErrMsg : this.batchVar.batchSuccessMsg;

        //To find duplicate module selection
        // let moduleId = this.batchVar.moduleForm.map(function (item) { return item.moduleId });
        // moduleId.sort();
        // let last = moduleId[0];
        // if (moduleId.length > 1) {
        //     for (let i = 1; i < moduleId.length; i++) {
        //         this.batchVar.moduleDuplicate = (moduleId[i] == last) ? true : false;
        //     }
        // }
            //this.toastr.success(toastrMsg);
            // this.alertService.success(toastrMsg);
            // this.router.navigateByUrl('/calendar');
            this.hidePopup();
    }

    hidePopup(){
        this.clearBatchForm();
        this.someEvent.next();
    }

    clearBatchForm() {
        // this.batchVar.moduleForm = [{
        //     moduleId: 1,
        //     program: "null",
        //     passpercentage: "null",
        //     mandatory: "true",
        // }];
        this.batchVar.batchFrom = '';
        this.batchVar.batchTo = '';
        this.batchVar.selectedEmp = [];
        this.batchVar.batchName = '';
        // this.router.navigateByUrl('/calendar');
    }

    //dynamic add module fields 
    addForm() {
        // let obj = {
        //     moduleId: 1,
        //     program: "null",
        //     passpercentage: "null",
        //     mandatory: "true",
        // };
        // this.batchVar.moduleForm.push(obj);
    }

    //dynamic remove module fields
    removeForm(i) {
     //   this.batchVar.moduleForm.splice(i, 1);
    }

    getFileDetails(event){
        if(event.target.files){
            this.uploadFileName = event.target.files[0] && event.target.files[0].name;
        }
         
    }

}
