import { Component, TemplateRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService,CommonService ,UtilService,CourseService,BreadCrumbService,PermissionService} from '../services';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../services/http.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CertificateVar } from '../Constants/certificate.var';
import { API_URL } from '../Constants/api_url';
import { AlertService } from '../services/alert.service';
import { CommonLabels } from "../Constants/common-labels.var";

@Component({
    selector: 'app-certificates',
    templateUrl: './certificates.component.html',
    styleUrls: ['./certificates.component.css'],
})

export class CertificatesComponent implements OnInit {
//getCourse

    percentageArray = [];
    percentageTakenError = {
        platinum: false,
        gold: false,
        silver: false,
        bronze: false
    };
    resortId;
    imgSrc;
    batchDetails = [];
    editFieldEnable = false;
    htmlPath;
    htmlName;
    removeCertificateIds = [];
    filePath;
    certificateId;
    htmlView;
    assignTo="course";
    assignToClicked = false;
    orginArray;
    existingFile = [];
    fileExist = false;


    constructor(private http: HttpService, public constant: CertificateVar, private modalService: BsModalService, private headerService: HeaderService, private toastr: ToastrService, private router: Router, private alertService: AlertService,public commonLabels:CommonLabels,private commonService : CommonService,private utilService : UtilService,private courseService : CourseService,private breadCrumbService : BreadCrumbService,private permissionService : PermissionService) {
        this.constant.url = API_URL.URLS;
    }
    ngOnInit() {
        this.headerService.setTitle({ title: this.commonLabels.titles.certificate, hidemodule: false });
        this.breadCrumbService.setTitle([])
        this.resortId = this.utilService.getUserData() && this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
        //get certificate

        this.getCertificate();
            //get course
        let userId = this.utilService.getUserData().userId;
        let query = '?created='+userId;
        this.courseService.getAllCourse(query).subscribe(resp=>{
            
            if(resp && resp.isSuccess){
                this.constant.courseList = resp.data.rows.length && resp.data.rows;
            }
        })
        let currentquery = '?resortId='+this.resortId;
      
      this.courseService.getDropTrainingClassList(currentquery).subscribe((resp) => {
            if(resp && resp.isSuccess){
                this.constant.trainingClassList =(resp.data && resp.data.rows.length) ? resp.data.rows :[]; 
                }else{
                    this.constant.trainingClassList = []; 
                }
        })

        this.getbadgepercentage();
        this.getAssignCertificateDetails();
    }

    permissionCheck(modules ,type){
        if(type == 'upload'){
            return this.permissionService.uploadPermissionCheck(modules);
        }
        else if(type == 'edit'){
            return this.permissionService.editPermissionCheck(modules);
        }
    }

    getAssignCertificateDetails(){
        this.commonService.getAssignCertificate(this.resortId).subscribe(resp=>{
            if(resp && resp.isSuccess && resp.data.length){
                this.assignTo ='';
                this.constant.templateAssign = resp.data.map(item=>{
                    let obj = {
                        course : item.courseId ? item.courseId : item.trainingClassId,
                        template : item.certificateId,
                        mappingId : item.certificateMappingId,
                        assignTo : item.courseId ? 'course' : 'tranClass' 
                    }
                    return obj;
                });
                this.orginArray = this.constant.templateAssign;
            }
        })
    }

    getCertificate() {
        this.commonService.getCertificate(this.resortId).subscribe(resp => {
            if (resp && resp.isSuccess) {
                this.filePath = resp.data && resp.data.path.uploadPath;
                this.constant.certificateList = resp.data && resp.data.certificates.length && resp.data.certificates.map(item => {
                    if (this.filePath) {
                        item.imageFile = this.filePath + item.certificateHtml;
                    }
                    return item;
                });
            }
        });
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
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: false,
        dots: false,
        navSpeed: 700,
        margin: 10,
        width: 333,
        item:3,
        height:200,
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
                items: 3
            }
        },
        nav: true,
        navText: ['<', '>']
    }

  
   openDeleteTemplate(template: TemplateRef<any>,certificateId){
     this.constant.modalRef = this.modalService.show(template);
      this.certificateId = certificateId;
   }

   deleteCertificate(){
       this.commonService.deleteCertificate(this.certificateId).subscribe(res=>{
          if(res.isSuccess){
            this.constant.modalRef.hide();
            this.alertService.success(this.commonLabels.msgs.badgeSuccessMsg);
            this.getCertificate();
          }
       })
   }


    openAddtemplate(template: TemplateRef<any>, certificateId) {
        if(this.permissionService.uploadPermissionCheck("Certificates")){
            this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
            if (certificateId) {
                this.certificateId = certificateId;
                this.commonService.getParticularCertificate(this.certificateId, this.resortId).subscribe(result => {
                    const certificateValues = result.data.certificates[0];
                    this.constant.tempName = certificateValues.certificateName;
                    this.constant.fileToUpload = certificateValues.certificateHtml;
                    this.filePath = result.data.path.uploadPath;
                    this.htmlView = this.filePath + certificateValues.certificateHtml;
                });
            } else {
                this.certificateId = '';
            }
        }
        else{
            this.alertService.warn("Sorry your file upload permission is disabled")
        }
    }


     htmlFileUpload(htmlFile) {
        this.commonService.uploadFiles(htmlFile).subscribe(result => {
            if (result && result.isSuccess) {
                this.htmlPath = result.path;
                this.htmlName = result.data[0].filename;
                this.htmlView = this.certificateId ? this.filePath + this.htmlName : '';
            } else {
                this.alertService.error(result.error);
            }
        }, err => {
              this.alertService.error(err.error.error);
              return;
        });
     }

    // Template File Upload
    handleFileInput(files: FileList) {
        this.fileExist = false;
        this.constant.fileToUpload = files.item(0);
        if(this.existingFile.length){
            this.existingFile.forEach(item=>{
              if(item == this.constant.fileToUpload.name){
                this.fileExist = true;
                this.constant.fileToUpload = null;
                // this.alertService.warn('File already exist')
              }
            })
          }
          if(!this.fileExist){
            this.existingFile.push(this.constant.fileToUpload.name);
            this.htmlFileUpload(this.constant.fileToUpload);
          }

    }


    uploadTemplate() {

    }

    //dynamic add form
    addForm() {
        let checkEmpty = {};

        // console.log( this.constant.templateAssign.length);
        checkEmpty = this.constant.templateAssign.length ? this.constant.templateAssign.find(x=>{ return x.course == null}) : {};

        // console.log(checkEmpty);
        // if(!checkEmpty){
        //     this.alertService.error(this.commonLabels.mandatoryLabels.selectCourse)
        // }else 
        if(this.assignTo == ""){
            this.alertService.error(this.commonLabels.mandatoryLabels.selectAssignTo);
        }else{
            let obj = {
                course: null,
                template: null
            };
            this.constant.templateAssign.push(obj);
        }
    }

    changeAssigning() 
    {
        this.constant.templateAssign = this.orginArray;
        let tempArray = [];
        if(this.assignTo == 'course' && this.constant.templateAssign)
        {
            tempArray = this.constant.templateAssign.filter(x => x.assignTo != 'tranClass')
        }
        else if(this.assignTo == 'tranClass' && this.constant.templateAssign)
        {
            tempArray = this.constant.templateAssign.filter(x => x.assignTo != 'course')
        }else{
            this.constant.templateAssign=[];	
        }
        this.constant.templateAssign=[];
        this.constant.templateAssign =tempArray;
       
       this.assignToClicked = true;
          let obj = {	
                course: null,	
                template: null	
            };	
        this.constant.templateAssign.push(obj);
    }

    checkCourse(id){
        let valueArr = this.constant.templateAssign.map(function(item){ return parseInt(item.course) });
        let isDuplicate = valueArr.some(function(item, idx) {
            return (valueArr.indexOf(item) != idx)
        });
        if(isDuplicate){
            let idx =  this.constant.templateAssign.length -1;
            this.constant.templateAssign[idx] = {
                course: null,
                template: null
            };
            this.alertService.error(this.commonLabels.mandatoryLabels.courseUnique);
        }
    }

    //Assign template to batch
    assignBatchTemplate(form) {
        let checkEmpty = [];
        checkEmpty = this.constant.templateAssign.length ? this.constant.templateAssign.filter(x=>{ return (x.course == null || x.template == null)}) : [];
        if (checkEmpty.length) {
            this.alertService.error(this.commonLabels.mandatoryLabels.profileMandatory);
        } else {
          
            const data = this.constant.templateAssign.map(item => {
                let obj = {
                    certificateId : item.template,
                    certificateMappingId : ''
                };
                if(this.assignTo == 'course'){
                    obj['courseId'] = item.course;
                }else{
                    obj['trainingClassId'] = item.course;
                }
                item.mappingId ? obj.certificateMappingId = item.mappingId : delete obj.certificateMappingId;
                return obj;
            });

            const params = {'certificateCourses': data, removeCertificateIds : []};
            this.removeCertificateIds.length ? params.removeCertificateIds = this.removeCertificateIds : delete params.removeCertificateIds;
            // console.log(params ,"checkEmpty",this.constant.templateAssign)
            this.commonService.assignCertificate(params).subscribe(resp => {
                if (resp && resp.isSuccess) {
                    this.getAssignCertificateDetails();
                    this.assignToClicked = false;
                }
            });
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
                    // console.log(resp);
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
            course: null,
            template: null
        }];
    }

    clearMessage() {
        this.clearAssignTemplate();
    }

    removeForm(i) {
        this.constant.templateAssign[i].mappingId ? this.removeCertificateIds.push(this.constant.templateAssign[i].mappingId) : '';
        this.constant.templateAssign.splice(i, 1);
    }

    // Add Certificate Template
    onSave(form) {
        if (form.valid) {
            let apiService;
            // if (this.constant.fileToUpload) {
                const postData = {
                    certificateName: this.constant.tempName,
                    certificateHtml: this.htmlName,
                    certificateHtmlPath: this.htmlPath,
                    resortId: this.utilService.getUserData().ResortUserMappings[0].resortId
                };
                if (!this.certificateId) {
                    apiService =  this.commonService.addCertificate(postData);
                } else {
                    apiService = this.commonService.updateCertificate(this.certificateId, postData);
                }
                apiService.subscribe(result => {
                    if (result && result.isSuccess) {
                        this.alertService.success(result.data);
                        this.getCertificate();
                    } else {
                        this.alertService.error(result.error.error);
                    }
                 } , err => {
                      this.alertService.error(err.error.error);
                      return;
                });
                this.alertService.success(this.commonLabels.msgs.uploadSuccessMsg);
                this.clearAddForm();
            // } else {
            //     //  this.toastr.error(this.constant.uploadErrMsg);
            //     this.alertService.error(this.commonLabels.mandatoryLabels.uploadErrMsg);
            // }
        }

    }

    //clear Add Certificate
    clearAddForm() {
        this.constant.modalRef.hide();
        this.fileExist = false;
        this.constant.tempName = "";
        this.constant.fileToUpload = null;
    }

    ngOnDestroy(){
        this.fileExist = false;
        this.existingFile = [];
    }
}
