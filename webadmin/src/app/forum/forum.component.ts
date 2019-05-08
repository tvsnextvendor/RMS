import { Component, OnInit, TemplateRef} from '@angular/core';
import {HeaderService, ForumService} from '../services';
import {ForumVar} from '../Constants/forum.var';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { API_URL } from '../Constants/api_url';
import { AlertService } from '../services/alert.service';
import { CommonLabels } from '../Constants/common-labels.var';
import {Router} from '@angular/router';

@Component({
    selector: 'app-forum',
    templateUrl: './forum.component.html',
    styleUrls: ['./forum.component.css']
})

export class ForumComponent implements OnInit {
  pageSize;
  totalCount = 0;
  currentPage = 1;
  topicsArray = [{
    topics: ''
  }];
    constructor(private toastr: ToastrService,
      private modalService: BsModalService,
      private headerService: HeaderService,
      public forumVar: ForumVar,
      private forumService: ForumService,
      private router: Router,
      public commonLabels: CommonLabels) {
       this.forumVar.url = API_URL.URLS;
    }
    filteredNames = [];

   ngOnInit() {
    this.pageSize = 10;
    this.headerService.setTitle({title: this.forumVar.title, hidemodule: false});
    this.getForumList();
    this.forumService.listPage.subscribe(result => {
      if (result) {
        this.getForumList();
      }
    });
   }

    getForumList() {
      const pageDetails = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      this.forumService.getForumList(pageDetails).subscribe((result) => {
      this.forumVar.forumList = result.data.rows;
      this.totalCount = result.data.count;
     });
    }

    pageChanged(page) {
      this.currentPage = page;
      this.getForumList();
    }

    isPinned(forumId) {
      this.forumVar.isPinned = !this.forumVar.isPinned;
      const pinnedObj = this.forumVar.isPinned ? { isPinned: true } : { isPinned: false };
      this. forumUpdate(forumId, pinnedObj);
    }

    forumUpdate(forumId, pinnedObj) {
      this.forumService.forumUpdate(forumId, {forum: pinnedObj}).subscribe(result => {
        if (result && result.isSuccess) {
          this.toastr.success(this.forumVar.updateSuccessMsg);
        } else {
          this.toastr.error(result.error);
        }
      }, err => {
        this.toastr.error(err.error.error);
        return;
    });
    }

      isActive(forumId) {
        this.forumVar.isActive = !this.forumVar.isActive;
        const activebj = this.forumVar.isActive ?    { isActive: true } : { isActive: false };
        this.forumUpdate(forumId, activebj);
      }

    openEditModal(template: TemplateRef<any>, forum) {
        this.forumService.editPage({editPage: true, forumId: forum.forumId});
        this.forumVar.modalRef = this.modalService.show(template, this.forumVar.modalConfig);
        // this.forumVar.forumName = forum.forumName;
        // this.forumVar.forumId = forum.forumId;
        // this.topicsArray = forum.Topics;
        // // this.forumVar.topics=forum.topic;
        // // this.forumVar. = forum.departments;
        // this.forumVar.adminItems = forum.admins;
        // // this.filteredNames = this.forumVar.forumNameList.filter(item => item !== this.forumVar.forumName);
    }

    removeForum(forumId) {
      this.forumService.deleteForum(forumId).subscribe(result => {
        console.log(result, 'ressss');
        if (result && result.isSuccess) {
          this.toastr.success(this.forumVar.deleteSuccessMsg);
          this.getForumList();
        } else {
          this.toastr.error(result.error);
        }
      }, err => {
        this.toastr.error(err.error.error);
        return;
    });
    }

    checkNameUniqueness(forumName) {
        for (let i = 0; i <  this.filteredNames.length; i++) {
          if (forumName && this.filteredNames[i] === forumName) {
            this.forumVar.editNameValidate = true;
            break;
          } else {
            this.forumVar.editNameValidate = false;
          }
        }
      }

    // onSave(form) {
    //   if (form.valid && !this.forumVar.editNameValidate) {
    //     const postData = {
    //       forumid : this.forumVar.forumId,
    //       forumname : form.value.forumName,
    //       employeelist : form.value.empItems,
    //       adminlist  : form.value.admin
    //     };
    //    // this.toastr.success(form.value.forumName + this.forumVar.updateSuccessMsg);
    //     this.alertService.success(this.forumVar.updateSuccessMsg);
    //     this.forumVar.modalRef.hide();
    //  }
    // }]

    detailsPage(forumId) {
      this.forumService.editPage({forumId: forumId});
      this.router.navigateByUrl('/forumdetail');
    }


}
