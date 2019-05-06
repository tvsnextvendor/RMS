import { Component, TemplateRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../services/header.service';
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
        diamond: false,
        gold: false,
        silver: false,
        bronze: false
    };
    constructor(private http: HttpService, public constant: CertificateVar, private modalService: BsModalService, private headerService: HeaderService, private toastr: ToastrService, private router: Router, private alertService: AlertService,public commonLabels:CommonLabels) {
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
    }

    getbadgepercentage() {
        this.http.get(this.constant.url.getBadgePercentage).subscribe((data) => {
            this.constant.badgePercentage = data.badgePercentage;
        });
    }

    resetPercentage() {
        this.getbadgepercentage();
        this.constant.gold = null;
        this.constant.diamond = null;
        this.constant.silver = null;
        this.constant.bronze = null;
    }

    badgePercentageUPdate(name, value) {
        this.constant.badgesRequired = false;
        if (this.percentageArray.length) {
            let index = this.percentageArray.find(x => x.value === value);
            if (index) {
                switch (name) {
                    case "diamond":
                        this.constant.diamond = "null";
                        this.percentageTakenError.diamond = true;
                        this.percentageTakenError.gold = false;
                        this.percentageTakenError.silver = false;
                        this.percentageTakenError.bronze = false;
                        break;
                    case "gold":
                        this.constant.gold = "null";
                        this.percentageTakenError.diamond = false;
                        this.percentageTakenError.gold = true;
                        this.percentageTakenError.silver = false;
                        this.percentageTakenError.bronze = false;
                        break;
                    case "silver":
                        this.constant.silver = "null";
                        this.percentageTakenError.diamond = false;
                        this.percentageTakenError.gold = false;
                        this.percentageTakenError.silver = true;
                        this.percentageTakenError.bronze = false;
                        break;
                    case "bronze":
                        this.constant.bronze = "null";
                        this.percentageTakenError.diamond = false;
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
                this.percentageTakenError.diamond = false;
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
        if (badges.gold != null && badges.diamond != null && badges.silver != null && badges.bronze != null) {
            window.scrollTo(0, 0);
            this.alertService.success(this.commonLabels.msgs.badgeSuccessMsg);
            this.clearbatchSelection();
        } else {
            this.constant.badgesRequired = true;
        }
    }

    //Reset Badge Form
    clearbatchSelection() {
        this.constant.diamond = null;
        this.constant.gold = null;
        this.constant.silver = null;
        this.constant.bronze = null;
        this.percentageArray = [];
        this.constant.badgesRequired = false;
        this.percentageTakenError.diamond = false;
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
