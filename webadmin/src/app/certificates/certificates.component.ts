import { Component, TemplateRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService,CommonService ,UtilService} from '../services';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../services/http.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CertificateVar } from '../Constants/certificate.var';
import { API_URL } from '../Constants/api_url';
import { AlertService } from '../services/alert.service';
import { CommonLabels } from "../Constants/common-labels.var"

@Component({
    selector: 'app-certificates',
    templateUrl: './certificates.component.html',
    styleUrls: ['./certificates.component.css'],
})

export class CertificatesComponent implements OnInit {


    percentageArray = [];
    percentageTakenError = {
        platinum: false,
        gold: false,
        silver: false,
        bronze: false
    };
    resortId;
    batchDetails = [];
    editFieldEnable = false;
    constructor(private http: HttpService, public constant: CertificateVar, private modalService: BsModalService, private headerService: HeaderService, private toastr: ToastrService, private router: Router, private alertService: AlertService,public commonLabels:CommonLabels,private commonService : CommonService,private utilService : UtilService) {
        this.constant.url = API_URL.URLS;
    }
    ngOnInit() {
        this.headerService.setTitle({ title: this.commonLabels.titles.certificate, hidemodule: false });

        //get Template list
        this.http.get(this.constant.url.getTemplateList).subscribe((data) => {
            this.constant.certificateList = data.templatedetails;
        });

        this.getbadgepercentage();

        // //get course list
        this.http.get(this.constant.url.getCoursesList).subscribe((data) => {
            this.constant.courseList = data.courseDetails;
        });
        this.resortId = this.utilService.getUserData() && this.utilService.getUserData().Resorts[0].resortId;
    }

    getbadgepercentage() {
        this.http.get(this.constant.url.getBadgePercentage).subscribe((data) => {
            this.constant.badgePercentage = data.badgePercentage;
            this.getBadgeDetails();
        });
    }

    getBadgeDetails(){
        this.commonService.getBadge(this.resortId).subscribe(resp=>{
            if(resp && resp.isSuccess){
                this.batchDetails = resp.data.length ? resp.data : [];
                this.editFieldEnable = true;
                this.batchDetails.forEach(item=>{
                    this.constant[item.badgeName] = item.percentage;
                })
            }
        },err=>{
            console.log(err.error)
            if(err.error.error == 'No Data Found'){
                this.alertService.info(this.commonLabels.mandatoryLabels.badgeDataFound);
            }
        })

    }

    resetPercentage() {
        this.getbadgepercentage();
        this.constant.gold = null;
        this.constant.platinum = null;
        this.constant.silver = null;
        this.constant.bronze = null;
    }

    badgePercentageUPdate(name, value) {
        this.constant.badgesRequired = false;
        if (this.percentageArray.length) {
            let index = this.percentageArray.find(x => x.value === value);
            if (index) {
                switch (name) {
                    case "platinum":
                        this.constant.platinum = "null";
                        this.percentageTakenError.platinum = true;
                        this.percentageTakenError.gold = false;
                        this.percentageTakenError.silver = false;
                        this.percentageTakenError.bronze = false;
                        break;
                    case "gold":
                        this.constant.gold = "null";
                        this.percentageTakenError.platinum = false;
                        this.percentageTakenError.gold = true;
                        this.percentageTakenError.silver = false;
                        this.percentageTakenError.bronze = false;
                        break;
                    case "silver":
                        this.constant.silver = "null";
                        this.percentageTakenError.platinum = false;
                        this.percentageTakenError.gold = false;
                        this.percentageTakenError.silver = true;
                        this.percentageTakenError.bronze = false;
                        break;
                    case "bronze":
                        this.constant.bronze = "null";
                        this.percentageTakenError.platinum = false;
                        this.percentageTakenError.gold = false;
                        this.percentageTakenError.silver = false;
                        this.percentageTakenError.bronze = true;
                        break;
                }
            }
            else if (value === "null") {
                let index = this.percentageArray.findIndex(x => x.name === name);
                this.percentageArray.splice(index, 1);
            }
            else {
                let index = this.percentageArray.findIndex(x => x.name === name);
                index >= 0 ? this.percentageArray.splice(index, 1) : '';
                value !== "null" ? this.percentageArray.push({ "name": name, "value": value }) : '';
                this.percentageTakenError.platinum = false;
                this.percentageTakenError.gold = false;
                this.percentageTakenError.silver = false;
                this.percentageTakenError.bronze = false;
            }
        }
        else {
            this.percentageArray.push({ "name": name, "value": value })
        }
    }

    customOptions: any = {
        loop: false,
        mouseDrag: true,
        touchDrag: true,
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


    openAddtemplate(template: TemplateRef<any>) {
        this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
    }

    //Template File Upload
    handleFileInput(files: FileList) {
        this.constant.fileToUpload = files.item(0);
    }

    //dynamic add form
    addForm() {
        let obj = {
            course: 1,
            template: 1
        };
        this.constant.templateAssign.push(obj);
    }

    //Assign template to batch
    assignBatchTemplate(form) {
        let batchId = this.constant.templateAssign.map(function (item) { return item.program });
        batchId.sort();
        let last = batchId[0];
        window.scrollTo(0, 0);
        if (batchId.length > 1) {
            for (let i = 1; i < batchId.length; i++) {
                if (batchId[i] == last) {
                    this.alertService.error(this.commonLabels.mandatoryLabels.assignErrMsg);
                    // this.toastr.error(this.constant.assignErrMsg);
                } else {
                    let postData = this.constant.templateAssign;
                    this.alertService.success(this.commonLabels.msgs.assignSuccessMsg);
                    //this.toastr.success(this.constant.assignSuccessMsg);
                    this.clearAssignTemplate();
                }
                last = batchId[i];
            }
        } else {
            let postData = this.constant.templateAssign;
            this.alertService.success(this.commonLabels.msgs.assignSuccessMsg);
            //this.toastr.success(this.constant.assignSuccessMsg);
        }
    }

    //Batch percentage selection
    batchSelection(form) {
        const badges = form.value;
        if (badges.gold != null && badges.platinum != null && badges.silver != null && badges.bronze != null) {
           if(this.batchDetails.length){
                let data = this.batchDetails.map((item,i)=>{
                    delete item.created;
                    delete item.updated;
                    if(item.badgeName == 'platinum'){
                        item.percentage = this.constant.platinum;
                    }
                    if(item.badgeName == 'gold'){
                        item.percentage = this.constant.gold;
                    }
                    if(item.badgeName == 'silver'){
                        item.percentage = this.constant.silver;
                    }
                    if(item.badgeName == 'bronze'){
                        item.percentage = this.constant.bronze;
                    }
                    return item;
                })
                let obj = {"badges" : data}
                this.commonService.addBadges(obj).subscribe(resp=>{
                    console.log(resp);
                })
           }
           else{
            let obj = 
            {"badges" :
                [
                    {"badgeName" : "platinum","percentage" : form.value.platinum,"resortId" : this.resortId},
                    {"badgeName" : "gold","percentage" : form.value.gold,"resortId" : this.resortId},
                    {"badgeName" : "silver","percentage" : form.value.silver,"resortId" : this.resortId},
                    {"badgeName" : "bronze","percentage" : form.value.bronze,"resortId" : this.resortId}
                ]   
            }
            this.commonService.addBadges(obj).subscribe(resp=>{
                if(resp && resp.isSuccess){
                    this.getBadgeDetails();
                }
                else{
                    console.log(resp.message)
                }
            },err=>[
                this.alertService.error(err.message)
            ])
           }
            // window.scrollTo(0, 0);
            this.alertService.success(this.commonLabels.msgs.badgeSuccessMsg);
            // this.clearbatchSelection();
        } else {
            this.constant.badgesRequired = true;
        }
    }

    //Reset Badge Form
    clearbatchSelection() {
        this.editFieldEnable = false;
        this.constant.platinum = null;
        this.constant.gold = null;
        this.constant.silver = null;
        this.constant.bronze = null;
        this.percentageArray = [];
        this.constant.badgesRequired = false;
        this.percentageTakenError.platinum = false;
        this.percentageTakenError.gold = false;
        this.percentageTakenError.silver = false;
        this.percentageTakenError.bronze = false;
    }

    //Reset Form
    clearAssignTemplate() {
        this.constant.templateAssign = [{
            course: 1,
            template: 2
        }];
    }

    clearMessage() {
        this.clearAssignTemplate();
    }

    removeForm(i) {
        this.constant.templateAssign.splice(i, 1);
    }

    //Add Certificate Template
    onSave(form) {
        if (form.valid) {
            if (this.constant.fileToUpload) {
                let postData = {
                    templatename: form.templateName,
                    htmlfile: this.constant.fileToUpload
                }
                this.alertService.success(this.commonLabels.msgs.uploadSuccessMsg);
                // this.toastr.success(this.constant.uploadSuccessMsg);
                this.clearAddForm();
            } else {
                //  this.toastr.error(this.constant.uploadErrMsg);
                this.alertService.error(this.commonLabels.mandatoryLabels.uploadErrMsg);
            }
        }

    }

    //clear Add Certificate
    clearAddForm() {
        this.constant.modalRef.hide();
        this.constant.tempName = "";
        this.constant.fileToUpload = null;
    }





}
