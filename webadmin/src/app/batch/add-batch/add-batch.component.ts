import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {Router} from '@angular/router';
import {ToastrService } from 'ngx-toastr';
import {BatchVar} from '../../Constants/batch.var';
import { HttpService } from 'src/app/services/http.service';
import { API_URL } from '../../Constants/api_url';
import {IMultiSelectSettings} from 'angular-2-dropdown-multiselect';

@Component({
    selector: 'app-add-batch',
    templateUrl: './add-batch.component.html',
    styleUrls: ['./add-batch.component.css']
})

export class AddBatchComponent implements OnInit {

   constructor(private headerService:HeaderService,private http:HttpService,private batchVar: BatchVar,private toastr:ToastrService,private router:Router){
       this.batchVar.url = API_URL.URLS;
   }

   ngOnInit(){
    this.headerService.setTitle({title:this.batchVar.title, hidemodule:false});

    //get Employee list
    this.http.get(this.batchVar.url.getEmployeeList).subscribe((resp) => {
        this.batchVar.employeeList = resp.employeeList;
      });
     
     //get Module list
      this.http.get(this.batchVar.url.getModuleList).subscribe((data) => {
        this.batchVar.moduleList= data.ModuleList;
      }); 
         
      //get percentage list
      this.http.get(this.batchVar.url.getPercentageList).subscribe((data) => {
        this.batchVar.percentageList= data.passPercentage;
      });

   }

    // Settings configuration
    mySettings: IMultiSelectSettings = {
        enableSearch: true,
        checkedStyle: 'fontawesome',
        buttonClasses: 'btn btn-default btn-block',
        dynamicTitleMaxItems: 5,
        displayAllSelectedText: true
    };

   
   addBatch(){
       let postData={
           FromDate : this.batchVar.batchFrom,
           ToDate   : this.batchVar.batchTo,
           EmployeeIds : this.batchVar.employeeId,
           BatchName : this.batchVar.batchName,
           ModuleDetails : this.batchVar.moduleForm
       }
       console.log(postData)
   }

   clearBatchForm(){
    this.batchVar.moduleForm = [{
        moduleId : 1,
        passpercentage:"null",
        mandatory :"true",
     }];
   }

   addForm(){
     let obj={
            moduleId : 1,
            passpercentage:"null",
            mandatory :"true",
     };
     this.batchVar.moduleForm.push(obj);
   }
  removeForm(i){
    this.batchVar.moduleForm.splice(i, 1);   
  }
  

   
}
