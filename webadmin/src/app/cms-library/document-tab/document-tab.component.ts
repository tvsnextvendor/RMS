import { Component, OnInit,Input,TemplateRef , EventEmitter, Output} from '@angular/core';
import { HeaderService, HttpService, CourseService, AlertService } from '../../services';
import { CmsLibraryVar } from '../../Constants/cms-library.var';
import { BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-document-tab',
  templateUrl: './document-tab.component.html',
  styleUrls: ['./document-tab.component.css']
})
export class DocumentTabComponent implements OnInit {
  @Input() trainingClassId;
  @Input() uploadPage;
  totalVideosCount = 0;
  videoListValue;
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

  @Input() CMSFilterSearchEventSet;
  @Output() selectedVideos  = new EventEmitter<object>();


  constructor(private courseService: CourseService,private alertService: AlertService,public constant: CmsLibraryVar, private modalService : BsModalService) { 

  }

  ngOnInit(){
    this.pageSize = 10;
    this.page=1;
    this.getCourseFileDetails();
    this.getCourseAndTrainingClass();
  }
  ngDoCheck(){
    if(this.CMSFilterSearchEventSet !== undefined && this.CMSFilterSearchEventSet !== ''){
      this.getCourseFileDetails();
    }
  }



  getCourseAndTrainingClass(){
    this.courseService.getAllCourse().subscribe(result=>{
      if(result && result.isSuccess){
        this.courseList = result.data && result.data.rows;
      }
    })
  }

   courseChange(){
     this.selectedClass="";
      this.courseService.getTrainingclassesById(this.selectedCourse).subscribe(result=>{
      if(result && result.isSuccess){       
           this.trainingClassList = result.data;
        }
    })
   }



  getEditFileData(){
      this.courseService.getEditCourseDetails( this.selectedCourse,this.selectedClass).subscribe(resp => {
        if(resp && resp.isSuccess){
          let files = resp.data.length && resp.data[0].CourseTrainingClassMaps.length && resp.data[0].CourseTrainingClassMaps[0].TrainingClass && resp.data[0].CourseTrainingClassMaps[0].TrainingClass.Files.length ? resp.data[0].CourseTrainingClassMaps[0].TrainingClass.Files : [] ;
           files.map(x=>{
             if(x.fileType=="Document"){
                this.fileList.push(x);
              }
           })
        }
      })
  }


  AddFilestoEditCourse(){
    this.selectedVideos.emit(this.fileList);
  }



  getCourseFileDetails() {
    let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet);
    let classId = this.trainingClassId ? this.trainingClassId : '';
    this.courseService.getFiles('Document',classId,this.page,this.pageSize,query).subscribe(resp => {
      this.CMSFilterSearchEventSet = '';
      if (resp && resp.isSuccess) {
        this.totalVideosCount = resp.data.count;
        this.videoListValue = resp.data && resp.data.rows.length ? resp.data.rows : []; 
      }
    },err =>{
      this.CMSFilterSearchEventSet = '';
    });
  
  }

  formatBytes(bytes, decimals = 2) {
    console.log(bytes)
    if (bytes === 0 || bytes === null) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

  openAddVideosToCourse(){
   
    this.addVideosToCourse = !this.addVideosToCourse;
  }
  pageChanged(e){
    this.page = e;
    this.getCourseFileDetails();
  }

   addFiles(event,file,i){
    let type=event.target.checked;
    if(type){
      file['addNew'] = true;
      this.fileList.push(file);
    }else{
      let index = this.fileList.findIndex(x => x.fileId === file.fileId);
      this.fileList.splice(index,1);
    }
  }



   removeDoc(template: TemplateRef<any>,fileId, i) {
    let modalConfig={
      class : "modal-dialog-centered"
    }

     this.constant.fileId= fileId;
     this.constant.modalRef = this.modalService.show(template,modalConfig); 
    }

     deleteDoc(){
     this.courseService.deleteDocument(this.constant.fileId).subscribe((result)=>{
         if(result.isSuccess){
             this.constant.modalRef.hide();
             this.getCourseFileDetails();
             this.alertService.success(result.message);
         }
     })
   }


}
