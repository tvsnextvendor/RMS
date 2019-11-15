import { Component, OnInit, TemplateRef } from '@angular/core';
import { Location } from '@angular/common'; 
import {Router, ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';
import {CourseService,BreadCrumbService, AlertService,UtilService,ResortService,UserService,CommonService} from '../../../services';
import { CommonLabels } from '../../../Constants/common-labels.var';
import { CmsLibraryVar } from '../../../Constants/cms-library.var';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-content-file',
  templateUrl: './content-file.component.html',
  styleUrls: ['./content-file.component.css']
})
export class ContentFileComponent implements OnInit {

  courseId;
  trainingVideoUrl;
  fileList;
  uploadPath;
  modalRef : BsModalRef;
  fileId;
  pageSize;
  page;
  userData;
  currentPage;
  userListData;
  totalCourseCount;
  userListSize;
  permissionFileId;
  selectAllPermission = false;
  
  constructor(private breadCrumbService :BreadCrumbService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute, 
    public commonLabels: CommonLabels,
    private modalService:BsModalService,
    private courseService: CourseService,
    private utilService : UtilService,
    public location :Location,
    public constant: CmsLibraryVar,
    private resortService :ResortService,
    private userService : UserService,
    private commonService : CommonService) {
      this.activatedRoute.params.subscribe((params: Params) => {
      this.courseId = params['id']; 
     });
   }

  ngOnInit() {
     this.pageSize = 10;
     this.page = 1;
     this.currentPage = 1;
     this.userListSize = 10;
    let data = [{title : this.commonLabels.labels.resourceLibrary,url:'/cms-library'},{title : this.commonLabels.labels.contentFile,url:''}]
    this.breadCrumbService.setTitle(data);
     this.getContentFiles();
     this.userData = this.utilService.getUserData().userId;
     const resortId = this.utilService.getUserData().ResortUserMappings.length &&  this.utilService.getUserData().ResortUserMappings[0].Resort.resortId; 
     this.resortService.getResortByParentId(resortId).subscribe((result)=>{
         this.constant.resortList=result.data.Resort;
         this.constant.divisionList=result.data.divisions;

     })
    }


      getPermissionList(type,data,i){
      // getPermissionList
      this.permissionFileId = data.fileId;
      let query = "?fileId="+data.fileId;
      this.courseService.getPermissionList(query).subscribe(resp=>{
        if(resp && resp.isSuccess){
          this.userListData = resp.data && resp.data.rows.length ? resp.data.rows : [];
          if(this.userListData.length){
            this.totalCourseCount = resp.data && resp.data.count;
            type != 'pagination' ? this.openUserList(type) : '';
          }
          else{
            this.alertService.warn('There no user permission for this file')
          }
        }
      })
      }

    userPageChanged(e){
      this.currentPage = e;
      let data ={fileId : this.permissionFileId};
      this.getPermissionList('userList',data,'');
    }

    openUserList(template: TemplateRef<any>) {
      let modalConfig={
        class:"modal-lg"
      }
      this.constant.modalRef = this.modalService.show(template,modalConfig);
    }

    closeModel(){
      this.permissionFileId = '';
      this.userListSize = 10;
      this.currentPage = 1;
      this.constant.modalRef.hide();
      // this.getCourseFileDetails();
    }

    getContentFiles(){
      let params = {
        courseId : this.courseId
       }
      this.courseService.getFiles(params).subscribe(resp=>{
      if(resp && resp.isSuccess){
        this.fileList = resp.data.rows;
        this.uploadPath = resp.data && resp.data.uploadPaths ? resp.data.uploadPaths.uploadPath : '';
        }
      })
    }

    viewTraningVideo(template: TemplateRef<any>, videourl) {
      let modalConfig={
        class:"modal-lg video-box"
      }
      this.modalRef = this.modalService.show(template, modalConfig);
      this.trainingVideoUrl = videourl;
    }

     openFileContent(data){
       let ext = data.fileUrl.split('.').pop();
       ext = ext.toLowerCase();
       let fileUrlSet = (data.inputUrl) ? data.inputUrl : this.uploadPath + data.fileUrl;
       console.log(ext)
       if(ext == 'docx' || ext == 'doc'){
        let url = 'https://docs.google.com/gview?embedded=true&url=' +fileUrlSet;
        window.open(url, "_blank");
       }else{
        let url = fileUrlSet;
        window.open(url, "_blank");
       }
       
     }



    
  //Open delete warning modal
   removeDoc(template: TemplateRef<any>,fileId, i) {
      let modalConfig={
        class : "modal-dialog-centered"
      }
     this.fileId= fileId;
     this.modalRef = this.modalService.show(template,modalConfig); 
    }

    //Delete document
  deleteDoc(){
  this.courseService.deleteDocument(this.fileId).subscribe((result)=>{
      if(result.isSuccess){
          this.modalRef.hide();
          this.getContentFiles();
          this.alertService.success(result.message);
      }
  })
  }

  openEditVideo(template: TemplateRef<any>, data, index) {
    let user = this.utilService.getUserData();
    this.popUpReset();
    let roleId = user.ResortUserMappings.length && user.ResortUserMappings[0].Resort.resortId;
    this.constant.fileId = data && data.fileId;
    this.constant.selectedResort = roleId;
    this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
  }

  popUpReset(){
    this.constant.errorValidate = false;
    this.constant.departmentList = [];
    this.constant.employeeList = [];
    this.constant.selectedDepartment = [];
    this.constant.selectedEmp = [];
    this.constant.selectedDivision = [];
    this.constant.fileId = '';
  }

  closeEditVideoForm() {
    this.constant.modalRef.hide();
  }
  permissionSetSubmit(){
    let user = this.utilService.getUserData();
    let resortId = user.ResortUserMappings.length && user.ResortUserMappings[0].Resort.resortId;
    
    if(this.constant.selectedDivision.length && this.constant.selectedDepartment.length && this.constant.selectedEmp.length ){
      let params = {
        "divisionId": this.constant.selectedDivision.map(item=>{return item.divisionId}),
        "departmentId" :this.constant.selectedDepartment.map(item=>{return item.departmentId}),
        "resortId" : resortId,
        "employeeId" : this.constant.selectedEmp.map(item=>{return item.userId}),
        "fileId" :  this.constant.fileId,
        "filePermissionType" : ''
      }
      this.selectAllPermission ? params.filePermissionType = 'Public' : params.filePermissionType = 'Restricted';
      this.courseService.setPermission(params).subscribe(resp=>{
        if(resp && resp.isSuccess){
          this.closeEditVideoForm();
          this.alertService.success(resp.message)
        }
      })
    }
    else{
      this.constant.errorValidation = this.commonLabels.mandatoryLabels.permissionError;
      this.constant.errorValidate = true;
    }
  }

  onEmpSelect(event, key,checkType,selectAll) {

    if (event.divisionId) {
      this.constant.divisionId = event.divisionId;
    } else if (event.departmentId) {
      this.constant.departmentId = event.departmentId;
    } else {
      this.constant.divisionId = '';
      this.constant.departmentId = '';
    }
    
    if (key == 'div') {
      const obj = { 'divisionId': this.constant.divisionId };
      this.commonService.getDepartmentList(obj).subscribe((result) => {
        if (result.isSuccess) {
          let listData =_.cloneDeep(this.constant.departmentList);
          this.constant.departmentList = [];
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
              this.constant.selectedDepartment = [];
              this.constant.selectedEmp = [];
          }
          this.constant.departmentList = listData.map(item=>{return item});
        }
      })
    }
    if (key == 'dept') {
      const data = { 'departmentId': this.constant.departmentId, 'createdBy': this.utilService.getUserData().userId }
      this.userService.getUserByDivDept(data).subscribe(result => {
        if (result && result.data) {
          // this.constant.employeeList && this.constant.employeeList.length ? result.data.forEach(item=>{this.constant.employeeList.push(item)}) : 
          // this.constant.employeeList = result.data;

          let listData =_.cloneDeep(this.constant.employeeList);
          this.constant.employeeList = [];
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
            this.constant.selectedEmp = [];
          }
        
          this.constant.employeeList = listData.map(item=>{return item});

          // this.allEmployees = result.data.reduce((obj, item) => (obj[item.userId] = item, obj), {});
        }
      })
    }
    if (key == 'emp') {
      this.selectAllPermission = selectAll;
    }
    if(this.constant.selectedDivision.length && this.constant.selectedDepartment.length && this.constant.selectedEmp.length ){
      this.constant.errorValidate = false
    }
    }



  formatBytes(bytes, decimals = 2) {
    if (bytes === 0 || bytes === null) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
}
  

