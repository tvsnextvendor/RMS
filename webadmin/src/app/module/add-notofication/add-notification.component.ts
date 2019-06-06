import { Component, OnInit ,Input,Output, EventEmitter} from '@angular/core';
import { HeaderService,UtilService,ResortService ,CourseService,CommonService,UserService,BreadCrumbService} from '../../services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { BatchVar } from '../../Constants/batch.var';
import { ModuleVar } from '../../Constants/module.var';
import { HttpService } from 'src/app/services/http.service';
import { API_URL } from '../../Constants/api_url';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import * as moment from 'moment';
import{ CommonLabels }  from '../../Constants/common-labels.var'

@Component({
    selector: 'app-add-notification',
    templateUrl: './add-notification.component.html',
    styleUrls: ['./add-notification.component.css']
})

export class AddNotificationComponent implements OnInit {
    @Output() someEvent = new EventEmitter<string>();
    // @Input() notificationType;
    @Output() completed = new EventEmitter<string>();
    durationValue = '1';
    reminder;
    showToDate = false;
    showFromDate = false;
    dateError = false;
    labels;
    file;
    fileName;
    description;
    moduleSubmitted;
    uploadFileName;
    notificationFileName;
    fileDuration;
    fileExtensionType;
    fileExtension;
    fileSize;
    fileImageDataPreview;
    notificationFileImage;
    notificationType;
    notifyType;
    userId;
    notifyId;
    employeeId
    removedUserIds = [];
    updatedUserIds={
      divisionId : [],
      departmentId : [],
      userId : []
    };

    constructor(private breadCrumbService :BreadCrumbService,public location : Location, private alertService: AlertService, private headerService: HeaderService,public moduleVar: ModuleVar, private datePipe: DatePipe, private activatedRoute: ActivatedRoute, private http: HttpService, public batchVar: BatchVar, private toastr: ToastrService, private router: Router,
        public commonLabels:CommonLabels , private utilService : UtilService,private resortService : ResortService,private courseService : CourseService,private commonService : CommonService,private userService : UserService) {
        this.batchVar.url = API_URL.URLS;
        this.labels = moduleVar.labels;
        this.userId = this.utilService.getUserData() && this.utilService.getUserData().userId;
        this.activatedRoute.queryParams.forEach(items=>{
          this.notifyId = items.notifyId;
        })
    }

    ngOnInit() {
      this.clearBatchForm();
      let data = this.notifyId ? [{title : this.commonLabels.labels.cmsLibrary,url:'/cms-library'},{title : this.commonLabels.btns.editNotification,url:''}] : [{title : this.commonLabels.labels.cmsLibrary,url:'/cms-library'},{title : this.commonLabels.btns.createNotification,url:''}]
      this.breadCrumbService.setTitle(data)
        // let startDate = localStorage.getItem('BatchStartDate');
        this.batchVar.batchFrom = new Date();
        this.batchVar.batchTo = '';
        this.batchVar.dategreater = true;
        const resortId = this.utilService.getUserData().ResortUserMappings[0].Resort.resortId; 
        this.moduleVar.selectedResort = resortId;
        this.getDropdownDetails(resortId,'init');
        this.getCourses();
    }

    getNotificationDetails(){
      let query = '?notificationFileId='+this.notifyId
        this.courseService.getNotification(query).subscribe(resp=>{
          console.log(resp)
          if(resp && resp.isSuccess){
            let respData = resp.data.rows.length && resp.data.rows[0];
            this.notificationType = respData.status == 'signRequired' ? 'signature' : (respData.courseId ? 'assignedToCourse' : 'nonSignature');
            if(respData.courseId){
              this.moduleVar.selectedCourses = respData.courseId;
              this.getTraingClassList(respData.courseId);
              setTimeout(()=>{
                this.moduleVar.selectedTrainingClass = respData.trainingClassId && respData.trainingClassId;
              },100);
            }
            this.uploadFileName = respData.File && respData.File.fileUrl;
            this.fileName = respData.File && respData.File.fileName;
            this.description = respData.File && respData.File.fileDescription;
            this.batchVar.batchFrom = new Date(respData.assignedDate);
            this.batchVar.batchTo = new Date(respData.dueDate);
            if(respData.NotificationFileMaps.length) {
              this.moduleVar.divisionId = respData.NotificationFileMaps.map(x=>{ return x.divisionId});
              this.moduleVar.departmentId = respData.NotificationFileMaps.map(x=>{ return x.departmentId});
              this.employeeId = respData.NotificationFileMaps.map(x=>{ return x.userId});
              this.onItemSelect({divisionId : this.moduleVar.divisionId },'division','select');
              setTimeout(()=>{
                this.onItemSelect({departmentId : this.moduleVar.departmentId },'dept','select');
              },100);
              setTimeout(()=>{
                this.setDropDownDetails();
              },500);
            }  
          }
        })
    }

    setDropDownDetails(){
          if(this.moduleVar.divisionId.length){
            this.moduleVar.selectedDivision=  this.moduleVar.divisionList.filter(item => this.moduleVar.divisionId.some(other => item.divisionId === other))
          } 
          else{
           let obj = this.moduleVar.divisionList.find(x=>x.divisionId == this.moduleVar.divisionId);
            this.moduleVar.selectedDivision.push(obj); 
          }
          if(this.moduleVar.departmentId.length){
            this.moduleVar.selectedDepartment=  this.moduleVar.departmentList.filter(item => this.moduleVar.departmentId.some(other => item.departmentId === other))
          }
          else{
            let obj = this.moduleVar.departmentList.find(x=>x.departmentId == this.moduleVar.departmentId);
             this.moduleVar.selectedDepartment.push(obj); 
           }
           if(this.employeeId.length){
            this.moduleVar.selectedEmployee=  this.moduleVar.employeeList.filter(item => this.employeeId.some(other => item.userId === other))
          }
          else{
            let obj = this.moduleVar.employeeList.find(x=>x.departmentId == this.employeeId);
             this.moduleVar.selectedEmployee.push(obj); 
           }
 
    }

    getDropdownDetails(resortId,key){
        
        this.resortService.getResortByParentId(resortId).subscribe((result)=>{
            if(key == 'init'){this.moduleVar.resortList=result.data.Resort;}
            this.moduleVar.divisionList=result.data.divisions;
            if(this.notifyId){
              this.getNotificationDetails();
            }
        })
    }

    getCourses(){
      this.courseService.getAllCourse().subscribe(result=>{
        if(result && result.isSuccess){
          this.moduleVar.courseList = result.data && result.data.rows;
        }
      })
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

    onItemSelect(event,key,checkType){
        if (event.divisionId) {
            this.moduleVar.divisionId = event.divisionId;
          } else if (event.departmentId) {
            this.moduleVar.departmentId = event.departmentId;
          }
          else {
            this.moduleVar.divisionId = '';
            this.moduleVar.departmentId = '';
          }
          if (key == 'division') {
            const obj = { 'divisionId': this.moduleVar.divisionId };
            this.commonService.getDepartmentList(obj).subscribe((result) => {
              if (result.isSuccess) {
                let listData =_.cloneDeep(this.moduleVar.departmentList);
                this.moduleVar.departmentList = [];
                if(checkType == 'select'){
                  listData && listData.length ? 
                  result.data.rows.forEach(item=>{listData.push(item)}) : 
                  listData = result.data.rows;
                  // this.constant.departmentList = listData.map(item=>{return item});
                }
                else{
                  result.data.rows.length && 
                    result.data.rows.forEach(resp=>{
                      listData.forEach((item,i)=>{
                        if(resp.departmentId == item.departmentId){
                          listData.splice(i,1)
                        }
                      }) 
                    })
                    this.moduleVar.selectedDepartment = [];
                    this.moduleVar.selectedEmployee = [];
                }
                this.moduleVar.departmentList = listData.map(item=>{return item});
              }
            })
          }
          if (key == 'dept') {
            const data = { 'departmentId': this.moduleVar.departmentId, 'createdBy': this.utilService.getUserData().userId }
            this.userService.getUserByDivDept(data).subscribe(result => {
              if (result && result.data) {
                // this.constant.employeeList && this.constant.employeeList.length ? result.data.forEach(item=>{this.constant.employeeList.push(item)}) : 
                // this.constant.employeeList = result.data;
      
                let listData =_.cloneDeep(this.moduleVar.employeeList);
                this.moduleVar.employeeList = [];
                if(checkType == 'select'){
                  listData && listData.length ? 
                  result.data.forEach(item=>{listData.push(item)}) : 
                  listData = result.data;
                }
                else{
                  result.data.length && 
                  result.data.forEach(resp=>{
                    listData.forEach((item,i)=>{
                      if(resp.userId == item.userId){
                        listData.splice(i,1)
                      }
                    }) 
                  })
                  this.moduleVar.selectedEmployee = [];
                }
              
                this.moduleVar.employeeList = listData.map(item=>{return item});
      
                // this.allEmployees = result.data.reduce((obj, item) => (obj[item.userId] = item, obj), {});
              }
            })
          }
          if(this.notifyId && key == 'emp'){
            if(checkType == 'select'){
              // this.updatedUserIds
              let user = this.employeeId.findIndex(item=>item == event.userId);
              if(!user){
                let data = this.moduleVar.employeeList.find(x=>x.userId == event.userId);
                this.updatedUserIds.divisionId.push(data.ResortUserMappings.length && data.ResortUserMappings[0].divisionId);
                this.updatedUserIds.departmentId.push(data.ResortUserMappings.length && data.ResortUserMappings[0].departmentId);
                this.updatedUserIds.userId.push(data.userId);
              }
            }
            else{
              this.removedUserIds.push(event.userId);
            }
            // this.employeeId
            console.log(event,this.moduleVar.employeeList)
          }
          if(this.moduleVar.selectedDivision.length && this.moduleVar.selectedDepartment.length && this.moduleVar.selectedEmployee.length ){
            this.moduleVar.errorValidate = false
          }
    }

    onItemDeselect(event,key){

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
      //addTypeOneNotification
        this.batchVar.empValidate = this.batchVar.employeeId ? false : true;
        if(this.fileExtensionType === 'Video'){
          this.commonService.uploadFiles(this.fileImageDataPreview ).subscribe(resp=>{
            if(resp && resp.isSuccess){
                this.notificationFileImage = resp.data.length && resp.data[0].filename;
                this.submitNotification();
            }
          })
        }else{
          this.submitNotification();
        }
    }

    submitNotification(){
      this.batchVar.dategreater = Date.parse(this.batchVar.batchTo) > Date.parse(this.batchVar.batchFrom) ? true : false;
      if(this.fileName && (this.notificationFileName || this.uploadFileName) && this.moduleVar.selectedResort && this.moduleVar.selectedDivision.length && this.moduleVar.selectedDepartment.length && this.moduleVar.selectedEmployee.length && this.batchVar.batchTo && this.batchVar.dategreater){ 
        let data = {
          "courseId":'',
          "createdBy"  :this.userId,
          "trainingClassId":'',
          "signatureStatus" : true,
          "assignedDate":this.datePipe.transform(this.batchVar.batchFrom, 'yyyy-MM-dd'),
          "dueDate":this.datePipe.transform(this.batchVar.batchTo, 'yyyy-MM-dd'),
          "fileName":this.fileName,
          "fileDescription":this.description,
          "fileSize":this.fileSize,
          "fileExtension":this.fileExtensionType,
          "fileImage":this.notificationFileImage ? this.notificationFileImage : '',
          "fileType":this.fileExtension,
          "fileUrl":this.notificationFileName,
          "fileLength":this.fileDuration,
          "resortId":this.moduleVar.selectedResort,
          "divisionId":this.moduleVar.selectedDivision.map(x=>{return x.divisionId}),
          "departmentId":this.moduleVar.selectedDepartment.map(x=>{return x.departmentId}),
          "userId":this.moduleVar.selectedEmployee.map(x=>{return x.userId}),
          "removeUserIds":''
        }
        // if(!this.fileDuration){
        //   delete data.fileLength
        // }
        console.log(data ,"data");
        if(this.notificationType == 'assignedToCourse'){
          data.courseId = this.moduleVar.selectedCourses;
          data.trainingClassId = this.moduleVar.selectedTrainingClass;    
          delete data.signatureStatus; 
          if(this.notifyId){
            this.updateNotification(data);
          }     
          else{
            delete data.removeUserIds;
            this.courseService.addTypeOneNotification(data).subscribe(resp=>{
              if(resp && resp.isSuccess){
                // this.goTocmsLibrary();
                this.router.navigate(['/cms-library'],{queryParams : {type:"edit",tab:"notification"}});
                this.alertService.success(resp.message);
              }
            })
          }
        }
        else{
          delete data.courseId;
          delete  data.trainingClassId;
          if(this.notifyId){
            this.updateNotification(data);
          } 
          else{
            delete data.removeUserIds;
            data.signatureStatus = this.notificationType == 'signature' ? true : false;
            this.courseService.addTypeTwoNotification(data).subscribe(resp=>{
              console.log(resp)
              if(resp && resp.isSuccess){
                // this.goTocmsLibrary();
                this.router.navigate(['/cms-library'],{queryParams : {type:"edit",tab:"notification"}});
                this.alertService.success(resp.message);
              }
            })
          }
        }
      }
      else if(!this.batchVar.dategreater){
        this.alertService.error(this.commonLabels.mandatoryLabels.dateLimitError)
      }
      else{
        this.alertService.error(this.commonLabels.mandatoryLabels.permissionError)
      }
    }

    updateNotification(data){
      if(!this.notificationFileName){
        delete data.fileExtension;delete data.fileImage;delete data.fileLength;delete data.fileSize;delete data.fileType;delete data.fileUrl;
      }
      this.updatedUserIds.divisionId.length ? data.divisionId = this.updatedUserIds.divisionId : delete data.divisionId;
      this.updatedUserIds.departmentId.length ? data.departmentId = this.updatedUserIds.departmentId : delete data.departmentId;
      this.updatedUserIds.userId.length ? data.userId = this.updatedUserIds.userId : delete data.userId;
      this.removedUserIds.length ? data.removeUserIds = this.removedUserIds : delete data.removeUserIds;
      console.log(data,"final data")
      // updateNotification
      this.courseService.updateNotification(this.notifyId,data).subscribe(resp=>{
        console.log(resp,"response")
        if(resp && resp.isSuccess){
          this.router.navigate(['/cms-library'],{queryParams: {type:"edit",tab:"notification"}})
        }
      },err=>{
        console.log(err.error.message)
      })
    }

    hidePopup(){
        this.clearBatchForm();
        this.someEvent.next();
    }

    clearBatchForm() {
   
        this.batchVar.batchFrom = '';
        this.batchVar.batchTo = '';
        this.batchVar.selectedEmp = [];
        this.batchVar.batchName = '';
        this.moduleVar.selectedCourses = null;
        this.moduleVar.selectedTrainingClass = null;
        this.moduleVar.trainingClassList = [];
        this.moduleVar.selectedResort = [];
        this.moduleVar.selectedDepartment = [];
        this.moduleVar.selectedDivision = []
        this.moduleVar.selectedEmployee = [];
        this.moduleVar.employeeList = [];
        this.moduleVar.departmentList = [];
        this.notificationType = '';
    }

    courseSelect(event){
      console.log(event.target.name);
        if(event.target.value){
          let courseId = event.target.value;
          this.getTraingClassList(courseId);
        }
    }

    getTraingClassList(courseId){
      this.courseService.getTrainingclassesById(courseId).subscribe(result=>{
        if(result && result.isSuccess){
          this.moduleVar.trainingClassList = result.data && result.data.length && result.data;
        }
    })
    }

    getFileDetails(event){
      let self = this;
        if(event.target.files){
            var duration; 
            this.uploadFileName = event.target.files[0] && event.target.files[0].name;
            let file = event.target.files[0];
            // this.filePreviewImage(file);
            this.fileSize = file.size;
            // find video duration
            var video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function() {
            window.URL.revokeObjectURL(video.src);
            duration = video.duration;
            self.fileDuration = duration;
            }
            video.src = URL.createObjectURL(file);

            // document.querySelector("#video-element source").setAttribute('src', URL.createObjectURL(file));
            // find file extension
            // this.uploadFile = file;
            let type = file.type;
            let typeValue = type.split('/');
            let extensionType = typeValue[1].split('.').pop();
            this.fileExtension = extensionType;
            this.fileExtensionType = typeValue[0].split('.').pop() === "video" ? "Video" : "Document";
            if(this.fileExtensionType === 'Video'){
              this.filePreviewImage(file);
          }
            this.commonService.uploadFiles(file).subscribe(resp=>{
                console.log(resp);
                if(resp && resp.isSuccess){
                    this.notificationFileName = resp.data.length && resp.data[0].filename;
                }
            })
        }    
    }

    filePreviewImage(file){
      let self = this;
          var fileReader = new FileReader(); 
            fileReader.onload = function() {
              var blob = new Blob([fileReader.result], {type: file.type});
              var url = URL.createObjectURL(blob);
              var video = document.createElement('video');
              var timeupdate = function() {
                if (snapImage()) {
                  video.removeEventListener('timeupdate', timeupdate);
                  video.pause();
                }
              };
              video.addEventListener('loadeddata', function() {
                if (snapImage()) {
                  video.removeEventListener('timeupdate', timeupdate);
                }
              });
              var snapImage = function() {
                var canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                var image = canvas.toDataURL();
                var success = image.length > 100000;
                // if (success) {
                //   var img = document.querySelector('.thumbnail_img');
                //   img.setAttribute('src', image);
                //   URL.revokeObjectURL(url);
                // }
                return success;
              };
              video.addEventListener('timeupdate', timeupdate);
              video.preload = 'metadata';
              video.src = url; 
              // url = video.src; 
              fetch(url)
              .then(res => res.blob())
              .then(blob => {
                  self.fileImageDataPreview =  new File([blob], "File_name.png");
                  // self.fileImageDataPreview.type = "image/png";
              })  
              // Load video in Safari / IE11
              video.muted = true;
              //video.playsInline = true;
              video.play();
            };
            fileReader.readAsArrayBuffer(file);
  }

    goTocmsLibrary(){
      this.completed.emit('completed'); 
    }
    notificationTypeUpdate(type){
      this.notifyType = type;
      this.notificationTypeSubmit();
    }
    notificationTypeSubmit(){
      if(!this.notifyType){
        this.alertService.error('Please select the notification type')
      }
      console.log(this.notifyType)
      this.notificationType = this.notifyType;
    }

    back(){
      this.router.navigate(['/cmspage'],{queryParams:{type:'create'}})
    }
}
