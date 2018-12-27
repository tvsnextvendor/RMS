import { Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ForumVar} from '../../Constants/forum.var';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from '../../Constants/api_url';
import { AlertService } from 'src/app/services/alert.service';

@Component({
    selector: 'app-createForum',
    templateUrl: './createForum.component.html',
     styleUrls: ['./createForum.component.css']
})

export class CreateForumComponent implements OnInit {
   
    employeeItems;
    forumName;
    autocompleteItemsAsEmpObjects;
    topicsArray = [{
      topicName:''
    }];
    topics;
    successMessage;
   
   constructor(private toastr:ToastrService,private forumVar:ForumVar,private http: HttpService,private alertService:AlertService){
    this.forumVar.url = API_URL.URLS;
   }

   ngOnInit(){
   // this.getEmployeeList();
    this.getForumList();
    this.getDepartmentList();
   }

   getForumList(){
      this.http.get(this.forumVar.url.getForumList).subscribe((data) => {
      this.forumVar.forumList= data.forumDetails;
      this.forumVar.forumNameList=this.forumVar.forumList.map(item=>{
        return item.forumName;
      });
     });   
   }

   getDepartmentList(){
    this.http.get(this.forumVar.url.getDepartments).subscribe((resp) => {
        this.autocompleteItemsAsEmpObjects = resp.DepartmentList.map(item=>{
          return item.department;
        });
      });
 }

   getEmployeeList(){
     this.http.get(this.forumVar.url.getEmployeeList).subscribe((resp) => {
        this.employeeItems=resp.employeeList;
        this.autocompleteItemsAsEmpObjects = resp.employeeList.map(item=>{
          return item.name;
        });
      });
    }
    
    addTopic(){
      let obj={
        topicName:''
      };
      this.topicsArray.push(obj);
    }

    removeTopic(i){
      this.topicsArray.splice(i, 1);   
    }

    checkNameUniqueness(forumName){
      for (let i = 0; i <  this.forumVar.forumNameList.length; i++) {    
        if(forumName && this.forumVar.forumNameList[i]===forumName){
          this.forumVar.uniqueValidate=true;
          break;
        }else{
          this.forumVar.uniqueValidate=false;
        }
      }
    }

    onSubmitForm(form){
      if(this.topicsArray){
        this.topics = this.topicsArray.map(item=>{
           return item.topicName;
        });
      }

      if(form.valid && !this.forumVar.uniqueValidate ){
        let postData={
          forumName : form.value.forumName,
          employeeList : form.value.empItems,
          topic   : this.topics
        }; 
        this.alertService.success(this.forumVar.addSuccessMsg);
         // this.toastr.success(this.forumVar.addSuccessMsg);
          this.clearForm(form);
          this.forumVar.uniqueValidate=false;
      }
    }

    clearForm(formDir){
       this.forumName="";
       this.topicsArray = [{
        topicName:''
      }];
      formDir.reset();
      formDir.submitted  = false;
    }

}
