import { Component, OnInit,TemplateRef } from '@angular/core';
import { VideoVar } from '../Constants/video.var';
import { HttpService } from '../services/http.service';
import { HeaderService } from '../services/header.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
    constructor(public videoVar: VideoVar,private modalService:BsModalService,public http: HttpService, private headerService: HeaderService) { }
    
    modalRef: BsModalRef;
    videoLink;
    selectedModule;
    title:string = "Videos";
    hidemodule=1;


    ngOnInit() {
        this.getCourses('');
        this.getModuleList();
        this.headerService.setTitle({title:this.title, hidemodule:this.hidemodule});
        }

      ngDoCheck(){
            this.headerService.moduleSelection.subscribe(module => {
                this.selectedModule = module
             });    
        }

    onChangeModule(){
        this.getCourses(this.videoVar.moduleType);
    }

    getCourses(moduleType) {
        //moduleId to get courses based on selected module type.
        let moduleId= moduleType;
        this.http.get('5c0660b4330000bb4ce81634').subscribe((data) => {
            this.videoVar.courses = data;
        });
    }

    openModal(template: TemplateRef<any>, videolink) {
        this.videoLink= videolink;
        this.modalRef = this.modalService.show(template);
    }

    getModuleList(){
        this.http.get('5c08da9b2f00004b00637a8c').subscribe((data) => {
          this.videoVar.moduleList= data.ModuleList;
        });
    }

}