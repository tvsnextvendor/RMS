import { Component, OnInit,TemplateRef} from '@angular/core';
import {HeaderService} from '../services/header.service';
import {HttpService} from '../services/http.service';
import {ForumVar} from '../Constants/forum.var';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
    selector: 'app-forum',
    templateUrl: './forum.component.html',
    styleUrls: ['./forum.component.css'],
})

export class ForumComponent implements OnInit {
   
    forumName;
    topics;
    employeeItems;
    autocompleteItemsAsEmpObjects
    modalRef:BsModalRef;
    title:string = "Forum";
    hidemodule=false;

   constructor(private toastr:ToastrService,private modalService:BsModalService,private headerService:HeaderService,private forumVar:ForumVar,private http: HttpService){}

   ngOnInit(){

    this.headerService.setTitle({title:this.title, hidemodule:this.hidemodule});
   // this.headerService.setTitle('Forum');
    this.getForumList();
    this.getEmployeeList();
   }

    getForumList(){
          this.http.get('5c0e36222e00004d00043d43').subscribe((data) => {
          this.forumVar.forumList= data.forumDetails;
        });
    }

    getEmployeeList(){
        this.http.get('5c0928d52f0000c21f637cd0').subscribe((resp) => {
           this.autocompleteItemsAsEmpObjects = resp.employeeList.map(item=>{
             return item.name;
           });
         });
    }


    statusUpdate(forumName,status){
        let statusName = status ? " is Activated" : " is Deativated"
        this.toastr.success(forumName + statusName);
      }

    openEditModal(template: TemplateRef<any>, forum) {
        this.modalRef = this.modalService.show(template);
        this.forumName= forum.forumName;
        this.topics=forum.topic;
        this.employeeItems=forum.employeeDetails;
    }

    onSave(form){
      if(form.valid){
        let postData= form.value;
        this.toastr.success(form.value.forumName + " is updated successfully");
        this.modalRef.hide();
     }
    }


}
