import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import {Location} from "@angular/common";
import { ToastrService } from 'ngx-toastr';
import { HttpService, UtilService, AlertService, HeaderService, BreadCrumbService,CourseService,UserService} from '../services';
import { EmailVar } from '../Constants/email.var';
import { API_URL } from '../Constants/api_url';
import { CommonLabels } from '../Constants/common-labels.var';
import * as XLSX from 'xlsx';
import { debug } from 'util';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.css'],
    // encapsulation: ViewEncapsulation.None 
})

export class EmailComponent implements OnInit {
    email: any = {};
    emailForm: any = { 'this.commonLabels.labels.totext' : '', 'this.commonLabels.labels.cc': '', 'this.commonLabels.labels.subject': '' };
    departments: any = [];
    sendClicked = false;
    validEmail = false;
    selectedDepartment;
    userList = [];
    userDetails;
    dataModel;
    uploadFileName;
    editorConfig ={};
    setSignatureStatus: boolean = true;
    attachments=[];
    queryParamType;
    divisionList = [];
    departmentList = [];
    filterParentDivision = null;
    selectedType;

    constructor(private toastr: ToastrService,private utilService: UtilService,private headerService: HeaderService, private elementRef: ElementRef, private emailVar: EmailVar, private http: HttpService, private alertService: AlertService,public commonLabels:CommonLabels,private breadCrumbService :BreadCrumbService,private activatedRoute :ActivatedRoute,private router : Router,private courseService : CourseService,private userService : UserService,public location :Location) {
        this.email.url = API_URL.URLS;
        this.activatedRoute.queryParams.subscribe(item=>{
            // console.log(item)
            if(item && item.type){
                this.queryParamType = item.type;
                this.selectedType = item.selectedType
            }
            else{
                this.queryParamType = '';
                this.selectedType = '';
            }
        })
    }

    ngOnInit() {
        this.headerService.setTitle({ title: this.emailVar.title, hidemodule: false });
        this.breadCrumbService.setTitle([]);
        let userData = this.utilService.getUserData();
        let resortId = userData.ResortUserMappings && userData.ResortUserMappings.length && userData.ResortUserMappings[0].Resort ? userData.ResortUserMappings[0].Resort.resortId : '';
        resortId && this.getDivisionList(resortId);
        // this.departmentList();

       this.editorConfig= {
            "editable": true,
            "spellcheck": true,
            "height": "100px",
            "minHeight": "50px",
            "width": "auto",
            "minWidth": "0",
            "translate": "yes",
            "enableToolbar": true,
            "showToolbar": true,
            "placeholder": "Write Something...",
            "imageEndPoint": "",
            "toolbar": [
                ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
                ["fontName", "fontSize", "color"],
                ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
                ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
                ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
                // ["link", "unlink", "image", "video"]
                ["link", "image"]
            ]
        }

        if(this.queryParamType == 'exportmail'){
            let data = localStorage.getItem('mailfile');
            let file = JSON.parse(data)
            let title = this.selectedType == 'course' ? 'Course trend report' :  this.selectedType == 'class' ? 'Training class trend report' : this.selectedType == 'expire' ? 'Expire trend report' : this.selectedType == 'notification' ? 'Notiification trend report' : 'Trend report';
            this.exportAsExcelWithFile(file, title);
        }

    }

    getDivisionList(resortId){
        this.courseService.getDivision(resortId,'parent').subscribe(result=>{
            if(result && result.isSuccess){
              this.divisionList = result.data && result.data.divisions;
            }
          })
    }
    
    // departmentList() {
    //     this.http.get(this.email.url.getDepartments).subscribe((resp) => {
    //         this.departments = resp['DepartmentList'];
    //     });
    //     this.http.get(this.email.url.getUsers).subscribe((resp) => {
    //         this.userList = resp['UserList'];
    //     });
    // }

    sendMail() {
        // console.log(this.dataModel)
        this.sendClicked = true;
        if (this.emailForm.to && this.emailForm.subject) {
            // let toAddress = this.emailForm.to;
            let params = {
                'to' : (this.emailForm.to).toString(),
                'cc' : this.emailForm.cc,
                'subject' : this.emailForm.subject,
                'message' : this.dataModel,
                'file' : ''
            }
            const formData = new FormData();
                formData.append('to' ,(this.emailForm.to).toString());
                formData.append('cc' ,this.emailForm.cc,);
                formData.append('subject',this.emailForm.subject,);
                formData.append('message' , this.dataModel,);
            if(!this.attachments.length){
                delete params.file
            }
            else{
                formData.append( 'file' , this.attachments[0])
            }
            this.userService.sendEmailToUser(formData).subscribe(resp=>{
                // console.log(resp)
                if(resp && resp.isSuccess){
                    localStorage.removeItem('mailfile');
                    this.resetFields();
                    this.sendClicked = false;
                    if(this.queryParamType == 'exportmail'){
                        this.location.back();
                    }
                    this.alertService.success(resp.message);
                }
            },err=>{
                this.alertService.error(err.error.error);
            })
        }
        else if (!this.emailForm.to) {
            this.alertService.error(this.commonLabels.mandatoryLabels.addressMand);
        }
        else if (!this.emailForm.subject) {
            this.alertService.error(this.commonLabels.mandatoryLabels.subRequired);
        }
    }

    emailValidation() {
        if (this.emailForm.to === '') {
            this.selectedDepartment = '';
        }
        this.validEmail = this.emailForm.to && this.validationCheck("email", this.emailForm.to) === 'invalidEmail' ? true : false;
    }

    validationCheck(type, value) {
        if (type === "email") {
            var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailRegex.test(value)) {
                return "invalidEmail"
            }
        }
        if (type === "mobile") {
            let data = value.toString();
            let phoneNum = data.replace("+", "");
            let phoneNumValid = phoneNum ? (phoneNum.length === 10 ? true : false) : false;
            return phoneNumValid
        }
    }

    resetFields() {
        this.emailForm = { 'this.commonLabels.labels.totext' : '', 'this.commonLabels.labels.cc': '', 'this.commonLabels.labels.subject': '' };
        this.selectedDepartment = '';
        this.attachments = [];
        this.divisionList = [];
        this.departmentList = [];
        this.filterParentDivision = null;
        this.dataModel = '';

    }


    addSign() {
        this.userDetails = this.utilService.getUserData();
        // console.log(this.userDetails);
        let content = this.dataModel;
        const signature = "<br><b>Thanks,</b><br>" + this.utilService.getUserData().firstName + ' '+(this.utilService.getUserData().lastName ? this.utilService.getUserData().lastName : '');
        if(this.setSignatureStatus){
            this.dataModel = (content) ? content + signature : signature;
            this.setSignatureStatus = false;
        }
    }

    groupMail(group) {
        let userData = this.utilService.getUserData();
        let resortId = userData.ResortUserMappings ? userData.ResortUserMappings[0].Resort.resortId : '';
        let data = [];
        this.selectedDepartment = group.departmentId;
        let dept = [];
        this.emailForm.to = '';
        dept.push(this.selectedDepartment);
        let query = {"departmentId":dept,"resortId":resortId}
        this.userService.getUserByDivDept(query).subscribe(item=>{
            if(item && item.isSuccess){
                let result = item.data.length ? item.data : [];
                data = result.map(d=>{return d.email});
                // console.log(data)
                if (data.length) {
                    this.emailForm.to = data;
                }
            }
            else{
                this.alertService.warn(this.commonLabels.msgs.warnMsg)
            }    
        })
    }

     fileUpload(event,type){
            let files = type == 'mail' ? event : event.target.files;
            let content = this.dataModel;
            if (files.length > 0) {   
                this.attachments = files;           
                // console.log(this.attachments); // You will see the file
            } 
            else if(type == 'mail' && files){
                this.attachments.push(files); 
            }
    }

    removeAttachment(i){
        // console.log(i,"I");
        // console.log(this.attachments,"ATTACHMENTS");
        this.attachments.splice(i,1);
        if(this.queryParamType == 'exportmail'){
            localStorage.removeItem('mailfile');
            this.router.navigate(['/email']);
        }
        // this.attachments.filter((key, index) => {
        //     if (key.notificationId == notification.notificationId) {
        //         this.notificationList.splice(index, 1);
        //     }
        // })
    }

    exportAsExcelWithFile(json: any[], excelFileName: string): void {
    
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelWithFile(excelBuffer, excelFileName);
      }
    
     saveAsExcelWithFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
        });
        var file = new File([data],fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION,{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        // console.log(file)
        this.fileUpload(file,'mail')
      }

      divisionChange(divisionId){
        let id = divisionId
        this.emailForm.to = '';
        this.courseService.getDepartment(id).subscribe(result=>{
            this.departmentList = result.data.rows && result.data.rows.length && result.data.rows
        })
      }

      ngOnDestroy(){
        localStorage.removeItem('mailfile');
      }
}