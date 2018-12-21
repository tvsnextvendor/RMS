import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {Router} from '@angular/router';
import {ToastrService } from 'ngx-toastr';
import {BatchVar} from '../../Constants/batch.var';
import { HttpService } from 'src/app/services/http.service';
import { API_URL } from '../../Constants/api_url';


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
      
      let startDate=localStorage.getItem('BatchStartDate');
      this.batchVar.batchFrom= this.splitDate(startDate);
      this.batchVar.min =this.splitDate(new Date());

   }

    // Settings configuration
    mySettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      enableCheckAll : false,
      itemsShowLimit: 8,
    };

    splitDate(date){
      const newDate = new Date(date);
      const y = newDate.getFullYear();
      const d = newDate.getDate();
      const month= newDate.getMonth();
      const h= newDate.getHours();
      const m= newDate.getMinutes();
      return new Date(y,month,d, h, m);
    }


   
   addBatch(form){
     if(!this.batchVar.employeeId){
       this.batchVar.empValidate = true;
     }else{
       this.batchVar.empValidate = false;
     }
      if(Date.parse(this.batchVar.batchFrom) >= Date.parse(this.batchVar.batchTo)){
        this.batchVar.dategreater= true;
      }else{
        this.batchVar.dategreater=false;
        if(form.valid){
          let postData={
           FromDate : this.batchVar.batchFrom,
           ToDate   : this.batchVar.batchTo,
           EmployeeIds : this.batchVar.employeeId,
           BatchName : this.batchVar.batchName,
           ModuleDetails : this.batchVar.moduleForm
         }
         this.toastr.success('Batch Added Successfully');
         this.router.navigateByUrl('/calendar');
         this.clearBatchForm();
        }
      }  
   }

   clearBatchForm(){
    this.batchVar.moduleForm = [{
        moduleId : 1,
        passpercentage:"null",
        mandatory :"true",
     }];
     this.batchVar.batchFrom = '';
     this.batchVar.batchTo = '';
     this.batchVar.employeeId ='';
     this.batchVar.batchName = '';
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
