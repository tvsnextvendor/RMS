import { Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ForumVar} from '../../Constants/forum.var';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from '../../Constants/api_url';

@Component({
    selector: 'app-createForum',
    templateUrl: './createForum.component.html',
})

export class CreateForumComponent implements OnInit {
   
    employeeItems;
    forumName;
    topics;
    autocompleteItemsAsEmpObjects;

   constructor(private toastr:ToastrService,private forumVar:ForumVar,private http: HttpService){
    this.forumVar.url = API_URL.URLS;
   }

   ngOnInit(){
    this.getEmployeeList();
   }

   getEmployeeList(){
     this.http.get(this.forumVar.url.getEmployeeList).subscribe((resp) => {
        this.employeeItems=resp.employeeList;
        this.autocompleteItemsAsEmpObjects = resp.employeeList.map(item=>{
          return item.name;
        });
      });
    }
  

    onSubmitForm(form){
      if(form.valid){
          let postData=form.value;
          this.toastr.success(this.forumVar.addSuccessMsg);
      }
    }

    clearForm(){
       this.forumName="";
       this.topics="";
    }

}
