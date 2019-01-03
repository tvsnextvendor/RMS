import { Component, OnInit,TemplateRef} from '@angular/core';
import {HeaderService} from '../services/header.service';
import {HttpService} from '../services/http.service';
import {ForumVar} from '../Constants/forum.var';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { API_URL } from '../Constants/api_url';
import { AlertService } from '../services/alert.service';

@Component({
    selector: 'app-forum',
    templateUrl: './forum.component.html',
    styleUrls: ['./forum.component.css']
})

export class ForumComponent implements OnInit {
   

    constructor(private toastr:ToastrService,private modalService:BsModalService,private headerService:HeaderService,private forumVar:ForumVar,private http: HttpService,private alertService:AlertService){
       this.forumVar.url = API_URL.URLS;
    }
    filteredNames=[];

   ngOnInit(){
    this.headerService.setTitle({title:this.forumVar.title, hidemodule:false});
    this.getForumList();
   // this.getEmployeeList();
    this.getDepartmentList();
    this.getAdminList();
   }

    getForumList(){
          this.http.get(this.forumVar.url.getForumList).subscribe((data) => {
          this.forumVar.forumList= data.forumDetails;
        });
    }
    // getEmployeeList(){
    //     this.http.get(this.forumVar.url.getEmployeeList).subscribe((resp) => {
    //        this.forumVar.autocompleteItemsAsEmpObjects = resp.employeeList.map(item=>{
    //          return item.name;
    //        });
    //      });
    // }
    getDepartmentList(){
        this.http.get(this.forumVar.url.getDepartments).subscribe((resp) => {
            this.forumVar.autocompleteItemsAsEmpObjects = resp.DepartmentList.map(item=>{
              return item.department;
            });
          });
    }
    getAdminList(){
      this.http.get(this.forumVar.url.getAdminList).subscribe((resp) => {
        this.forumVar.adminList = resp.adminList.map(item=>{
          return item.name;
        });
      });
    }

    statusUpdate(forumName,status){
        let statusName = status ? " is Activated" : " is Deativated"
       // this.toastr.success(forumName + statusName);
        this.alertService.success(forumName + statusName);
      }

    openEditModal(template: TemplateRef<any>, forum) {
        this.forumVar.modalRef = this.modalService.show(template,this.forumVar.modalConfig);
        this.forumVar.forumName= forum.forumName;
        // this.forumVar.topics=forum.topic;
        this.forumVar.employeeItems=forum.departments;
        this.forumVar.adminItems=forum.admins;
        this.filteredNames = this.forumVar.forumNameList.filter(item => item !== this.forumVar.forumName);
    }
   
    checkNameUniqueness(forumName){  
        for (let i = 0; i <  this.filteredNames.length; i++) {    
          if(forumName && this.filteredNames[i]===forumName){
            this.forumVar.editNameValidate=true;
            break;
          }else{
            this.forumVar.editNameValidate=false;
          }
        }
      }
     
    onSave(form){
      if(form.valid && !this.forumVar.editNameValidate){
        let postData= form.value;
       // this.toastr.success(form.value.forumName + this.forumVar.updateSuccessMsg);
        this.alertService.success(form.value.forumName + this.forumVar.updateSuccessMsg);
        this.forumVar.modalRef.hide();
     }
    }


}
