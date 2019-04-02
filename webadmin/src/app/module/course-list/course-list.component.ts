import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { HttpService } from '../../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { ModuleVar } from '../../Constants/module.var';
import { API_URL } from '../../Constants/api_url';
import { AlertService } from 'src/app/services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
// import { AddBatchComponent} from '../../batch/add-batch/add-batch.component';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
})
export class CourseListComponent implements OnInit {
  
  constructor(private modalService: BsModalService, private http: HttpService, private alertService: AlertService, private route: Router, private activatedRoute: ActivatedRoute, public moduleVar: ModuleVar, private toastr: ToastrService, private headerService: HeaderService) {
    this.moduleVar.url = API_URL.URLS;
  }

  ngOnInit() {
    this.moduleVar.title = "Courses";
    this.headerService.setTitle({ title: this.moduleVar.title, hidemodule: false });
    this.http.get(this.moduleVar.url.getListPageCourse).subscribe((data) => {
      this.moduleVar.courseListPage = data;
    });

  }

  courseDetails(id){
    this.route.navigateByUrl('/modulelist/'+id);
  }

  openEditModal(template: TemplateRef<any>) {
    this.moduleVar.modalRef = this.modalService.show(template,this.moduleVar.modalConfig);
  }

}
