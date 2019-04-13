import { Component, OnInit, TemplateRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService, HttpService, AlertService } from '../services';
import { ToastrService } from 'ngx-toastr';
// import { TraingClassTabComponent } from './traing-class-tab/traing-class-tab.component'
import { BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-cms-library',
  templateUrl: './cms-library.component.html',
  styleUrls: ['./cms-library.component.css']
})
export class CMSLibraryComponent implements OnInit {
  constructor(private modalService: BsModalService, private http: HttpService, private alertService: AlertService, private route: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private headerService: HeaderService) { }
  modalRef;
  videoFile;
  selectedTab;
  redirectId;

  ngOnInit() {
    this.headerService.setTitle({ title: 'CMS Library', hidemodule: false });
    this.selectedTab = 'course';
  }

  openEditModal(template: TemplateRef<any>,modelValue) {
    let modalConfig= {class : "modal-xl"};
    this.modalRef = this.modalService.show(template,modalConfig);
  }

  headerTabChange(title){
    this.selectedTab = title;
    console.log("dataemit",title)
  }

  redirectTab(value){
    console.log(value);
    this.redirectId = value.id;
    this.headerTabChange(value.tab);
  }
  
}
