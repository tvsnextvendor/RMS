import { Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ForumVar} from '../../Constants/forum.var';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-createForum',
    templateUrl: './createForum.component.html',
})

export class CreateForumComponent implements OnInit {
   
    employeeItems;
    forumName;
    topics;
    autocompleteItemsAsEmpObjects;

   constructor(private toastr:ToastrService,private forumVar:ForumVar,private http: HttpService){}

   ngOnInit(){
    this.getEmployeeList();
   }

   getEmployeeList(){
     this.http.get('5c0928d52f0000c21f637cd0').subscribe((resp) => {
        this.employeeItems=resp.employeeList;
        this.autocompleteItemsAsEmpObjects = resp.employeeList.map(item=>{
          return item.name;
        });
      });
    }
  

    onSubmitForm(form){
      if(form.valid){
          let postData=form.value;
          this.toastr.success('Forum Added Successfully');
      }
    }

    clearForm(){
       this.forumName="";
       this.topics="";
    }

}
