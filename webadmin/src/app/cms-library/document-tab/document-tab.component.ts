import { Component, OnInit,Input,TemplateRef , EventEmitter, Output} from '@angular/core';
import { HeaderService, HttpService,BreadCrumbService, CourseService, AlertService, FileService, ResortService,UtilService,CommonService,UserService,PDFService,ExcelService,PermissionService} from '../../services';
import { CmsLibraryVar } from '../../Constants/cms-library.var';
import { CommonLabels } from '../../Constants/common-labels.var';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';




@Component({
  selector: 'app-document-tab',
  templateUrl: './document-tab.component.html',
  styleUrls: ['./document-tab.component.css']
})
export class DocumentTabComponent implements OnInit {
  @Input() trainingClassId;
  @Input() uploadPage;
  @Input() disableEdit;
  totalVideosCount = 0;
  videoListValue = [];
  addVideosToCourse = false;
  page;
  pageSize;
  p;
  total;
  selectedCourse="";
  selectedClass="";
  courseList;
  submitted=false;
  trainingClassList;
  fileList=[];
  deletedFilePath=[];
  deletedFileId=[];
  uploadPath;
  iconEnable = true;
  resourceLib = false;
  userData;
  filePermissionType = "Restricted";
  userListSize;
  currentPage;
  userListData = [];
  permissionFileId;
  totalCourseCount = 0;
  selectAllPermission = false;
 

  @Input() CMSFilterSearchEventSet;
  @Output() selectedVideos  = new EventEmitter<object>();


  constructor(private courseService: CourseService,
      private fileService: FileService,
      private alertService: AlertService,
      public commonLabels : CommonLabels,
      public constant: CmsLibraryVar,
       private utilService :UtilService,
      private commonService : CommonService,
      private userService : UserService,
      private resortService : ResortService,
      private pdfService :PDFService,
      private excelService :ExcelService ,
      private modalService: BsModalService,
      private breadCrumbService : BreadCrumbService,
      private permissionService : PermissionService) { 

  }

  ngOnInit(){
    this.pageSize = 10;
    this.page=1;
    this.userListSize = 10;
    this.currentPage = 1;
    let roleId = this.utilService.getRole();
    this.userData = this.utilService.getUserData().userId;
    if(window.location.pathname.indexOf("resource") != -1){
      let data = [{title : this.commonLabels.labels.resourceLibrary,url:'/resource/library'},{title : this.commonLabels.labels.documents,url:''}];
      this.breadCrumbService.setTitle(data);
      this.resourceLib = true;
      }else{
    let data = [{title : this.commonLabels.labels.edit,url:'/cmspage'},{title : this.commonLabels.labels.documents,url:''}]
    this.breadCrumbService.setTitle(data);
    this.resourceLib = false;
      }
      if(roleId == 4 && this.resourceLib || !this.permissionService.editPermissionCheck('Course / Training Class / Quiz')){
        this.iconEnable = false;
      }
      
    this.getCourseFileDetails();
    this.getCourseAndTrainingClass();

    const resortId = this.utilService.getUserData().ResortUserMappings.length &&  this.utilService.getUserData().ResortUserMappings[0].Resort.resortId; 
        this.resortService.getResortByParentId(resortId).subscribe((result)=>{
            this.constant.resortList=result.data.Resort;
            this.constant.divisionList=result.data.divisions;

        })
  }
  ngDoCheck(){
    if(this.CMSFilterSearchEventSet !== undefined && this.CMSFilterSearchEventSet !== ''){
      this.getCourseFileDetails();
    }
  }

  getCourseAndTrainingClass(){
    let userId = this.utilService.getUserData().userId;
    let query = '?created='+userId;
    this.courseService.getAllCourse(query).subscribe(result=>{
      if(result && result.isSuccess){
        this.courseList = result.data && result.data.rows;
      }
    })
  }

  openFileContent(data){
    let ext = data.fileUrl.split('.').pop();
    ext= ext.toLowerCase();
    console.log(ext,"EXT")
    if (ext == 'docx' || ext == 'doc') {
        let url = 'https://docs.google.com/gview?embedded=true&url=' + this.uploadPath + data.fileUrl;
        window.open(url, "_blank");
    } else {
        let url = this.uploadPath + data.fileUrl;
        window.open(url, "_blank");
    }
  }

 

   courseChange(){
     this.selectedClass="";
      this.courseService.getTrainingclassesById(this.selectedCourse).subscribe(result=>{
      if(result && result.isSuccess){       
           this.trainingClassList = result.data;
        }
    })
   }

//Remove selected video from form
  removeVideo(data,i){
     this.videoListValue.filter(function (x) {
           if(x.fileId == data.fileId){
             return x.selected = false; 
           }    
    }); 
    this.fileList.splice(i,1);
    this.deletedFilePath.push(data.fileUrl);
    this.deletedFileId.push(data.fileId);
    if(data.fileType === 'Video'){
      this.deletedFilePath.push(data.fileImage);
    }
  }


  //Get document list for selected course and training class.
  getEditFileData(){
      this.courseService.getEditCourseDetails( 'Document',this.selectedCourse,this.selectedClass).subscribe(resp => {
        if(resp && resp.isSuccess){
          let files = (resp.data.length && resp.data) ? resp.data :[];
        //  let files = resp.data.length && resp.data[0].CourseTrainingClassMaps.length && resp.data[0].CourseTrainingClassMaps[0].TrainingClass && resp.data[0].CourseTrainingClassMaps[0].TrainingClass.Files.length ? resp.data[0].CourseTrainingClassMaps[0].TrainingClass.Files : [] ;
          if(this.fileList){
           files.map(x=>{
             this.fileList.push(x);
           })
          }else{
           this.fileList= files;
          }
        }
      })
  }

 //Send selected files to cms library component.
  AddFilestoEditCourse(){
    this.selectedVideos.emit(this.fileList);
  }


 //Get document list 
  getCourseFileDetails() {
    let user = this.utilService.getUserData();
    let roleId = this.utilService.getRole();
    let resortId = user.ResortUserMappings && user.ResortUserMappings.length && user.ResortUserMappings[0].Resort.resortId;
    let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet) ? 
                  (roleId != 1 ? this.courseService.searchQuery(this.CMSFilterSearchEventSet)+'&resortId='+resortId  : this.courseService.searchQuery(this.CMSFilterSearchEventSet)) : 
                    roleId != 1 ? ((this.resourceLib || this.uploadPage) ? '&resortId='+resortId : '&resortId='+resortId +'&createdBy='+user.userId ): '';

  if (roleId == 4)
  {
    let accessSet = this.utilService.getUserData() && this.utilService.getUserData().accessSet == 'ApprovalAccess' ? true : false;
    query = (this.uploadPage || this.resourceLib) ? (query + "&draft=false") : (accessSet ? query + "&allDrafts=1" : query);
  }

    // let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet) ? this.courseService.searchQuery(this.CMSFilterSearchEventSet) : '';
    let classId = this.trainingClassId ? this.trainingClassId : '';
    let params={
      type: 'Document',
      classId: classId,
      page: this.page,
      size: this.pageSize,
      query: query
    }
    let selectedDocuments = this.fileService.getSelectedList('Document');
    this.courseService.getFiles(params).subscribe(resp => {
      this.CMSFilterSearchEventSet = '';
      if (resp && resp.isSuccess) {
        this.totalVideosCount = resp.data.count;
        if(resp.data.count === 0)
        {
          this.videoListValue = [];
        }else{
           this.videoListValue = resp.data && resp.data.rows.length ? resp.data.rows : []; 
           console.log(this.videoListValue,"FILELIST");
           console.log(selectedDocuments,"SelectedDocuments");
           _.merge(this.videoListValue, selectedDocuments); //This is not working properly
          
          // const cars1IDs = new Set(this.videoListValue.map(({ fileName }) => fileName));
          // const combined = [
          //     ...this.videoListValue,
          //     ...selectedDocuments.filter(({ fileName }) => !cars1IDs.has(fileName))
          // ];
          // console.log(combined, "Combined");
          // this.videoListValue = combined;

        this.uploadPath = resp.data && resp.data.uploadPaths ? resp.data.uploadPaths.uploadPath : '';
      }
       }
    },err =>{
      this.CMSFilterSearchEventSet = '';
    });
  
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0 || bytes === null) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

  //Hide and show Assign form popup 
  openAddVideosToCourse(){
    this.addVideosToCourse = !this.addVideosToCourse;
  }

  pageChanged(e){
    this.page = e;
    this.getCourseFileDetails();
  }

 //Add or remove files from list
   addFiles(event,file,i){
    let type=event.target.checked;
    if(type){
      file['addNew'] = true;
      file['selected'] = true;
      this.fileList.push(file);
      this.fileService.sendFileList('add',file);
    }else{
      let index = this.fileList.findIndex(x => x.fileId === file.fileId);
      file['selected'] = false;
      this.fileList.splice(index,1);
      this.fileService.sendFileList('remove',file);
    }
  }


  //Open delete warning modal
   removeDoc(template: TemplateRef<any>,fileId, i) {
    let modalConfig={
      class : "modal-dialog-centered"
    }
     this.constant.fileId= fileId;

     this.constant.modalRef = this.modalService.show(template,modalConfig); 
    }

  //Delete document
  deleteDoc(){
  this.courseService.deleteDocument(this.constant.fileId).subscribe((result)=>{
      if(result.isSuccess){
          this.constant.modalRef.hide();
          this.getCourseFileDetails();
          this.alertService.success(result.message);
      }
  })
  }

 //Assign document files to selected course and training class
  AssignNewFiles(){
      this.submitted=true;
      let self =this;
      let updatedFileList = this.fileList.filter(function (x) {
          if(x.addNew){
            x.trainingClassId = self.selectedClass;
            return delete x.addNew && delete x.TrainingClass;
          }
      }); 
      let fileIds = updatedFileList.map(a => a.fileId);
      updatedFileList.forEach(function(x){ delete x.fileId });
      let postData = {
        trainingClassId : this.selectedClass,
        courseId : this.selectedCourse,
        fileType :"document",
        assignedFiles: [],
        filesIds: fileIds,
     }

    if(this.submitted && this.selectedClass && this.selectedCourse && updatedFileList.length){
      this.courseService.assignVideosToCourse(postData).subscribe(res=>{
            if(res.isSuccess){
              this.alertService.success(res.message);
              this.openAddVideosToCourse();
              this.resetAssignForm();
              this.videoListValue.map(function (x) {
                return x.selected = false;     
              }); 
            }
      })
    }
    else if(!updatedFileList.length){
      this.alertService.error(this.commonLabels.mandatoryLabels.videoError)
    }
  }

  //To reset form.
  resetAssignForm(){
    this.selectedClass = "";
    this.selectedCourse = "";
    this.fileList =[];
    this.submitted=false;
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

  onEmpSelect(event,key,checkType,selectAll) {

    if (event.divisionId || (selectAll && key == 'div')) {
      this.constant.divisionId = selectAll ? event.map(item=>{return item.divisionId})  : event.divisionId;
      if(selectAll && !checkType){
        this.constant.departmentList = [];
        this.constant.employeeList = [];
        this.constant.selectedDepartment = [];
        this.constant.selectedEmp = [];
      }
    } else if (event.departmentId || (selectAll && key == 'dept')) {
      this.constant.departmentId = selectAll ? event.map(item=>{return item.departmentId})  : event.departmentId;
      if(selectAll && !checkType){
        // this.constant.departmentList = [];
        this.constant.employeeList = [];
        // this.constant.selectedDepartment = [];
        this.constant.selectedEmp = [];
      }
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
          "filePermissionType" : 'Restricted'
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

                  // Create PDF
 exportAsPDF(){ 
  // this.labels.btns.select =  this.labels.btns.pdf;
  var data = document.getElementById('docList'); 
  this.pdfService.htmlPDFFormat(data,this.commonLabels.titles.docTitle);  
} 
// Create Excel sheet
exportAsXLSX():void {
  // this.labels.btns.select =  this.labels.btns.excel;
  let data = this.videoListValue.map(item=>{
    let obj = {
      // 'File Id'   : item.fileId,
      'File name' : item.fileName,
      'File size' : this.formatBytes(item.fileSize),
      'File type' : item.fileExtension,
      // 'File description' : item.fileDescription,  
      // 'Created at' : item.created
    }
    return obj;
  })
  this.excelService.exportAsExcelFile(data, this.commonLabels.titles.docTitle);
}

getPermissionList(type,data,i){
  // getPermissionList
  this.permissionFileId = data.fileId;
  let query = '?page='+this.currentPage+"&size="+this.userListSize+"&fileId="+data.fileId;
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

userPageChanged(e){
  this.currentPage = e;
  let data ={fileId : this.permissionFileId};
  this.getPermissionList('pagination',data,'');
}


}
