import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {Router} from '@angular/router';
import {ToastrService } from 'ngx-toastr';
import {BatchVar} from '../../Constants/batch.var';
import { HttpService } from 'src/app/services/http.service';
import { API_URL } from '../../Constants/api_url';
import {ActivatedRoute, Params} from '@angular/router';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-add-batch',
    templateUrl: './add-batch.component.html',
    styleUrls: ['./add-batch.component.css']
})

export class AddBatchComponent implements OnInit {


   constructor(private alertService:AlertService,private headerService:HeaderService,private datePipe: DatePipe,private activatedRoute : ActivatedRoute,private http:HttpService,private batchVar: BatchVar,private toastr:ToastrService,private router:Router){
        this.batchVar.url = API_URL.URLS; 
        this.activatedRoute.params.subscribe((params: Params) => {
        this.batchVar.batchId = params['batchId'];
      });
   }


   ngOnInit(){
     this.batchVar.batchId ?this.headerService.setTitle({title:this.batchVar.editTitle, hidemodule:false}):
     this.headerService.setTitle({title:this.batchVar.title, hidemodule:false});
     
  
     //get Department list
     this.http.get(this.batchVar.url.getDepartments).subscribe((data) => {
          this.batchVar.employeeList = data.DepartmentList;
     });
  

     //get Module list
      this.http.get(this.batchVar.url.getModuleList).subscribe((data) => {
        this.batchVar.moduleList= data.moduleList;
      }); 
         
      //get percentage list
      this.http.get(this.batchVar.url.getPercentageList).subscribe((data) => {
        this.batchVar.percentageList= data.passPercentage;
      });
      
      let startDate=localStorage.getItem('BatchStartDate');
      this.batchVar.batchFrom= this.splitDate(startDate).toISOString();
      this.batchVar.min =this.splitDate(new Date());
      this.getBatchDetail();
   }


  //get edit batch details
  getBatchDetail(){
    this.http.get(this.batchVar.url.getNewBatchList).subscribe((data) => {
      this.batchVar.batchList= data.batchDetails;
      if(this.batchVar.batchId){
      let batchObj = this.batchVar.batchList.find(x=>x.batchId === parseInt(this.batchVar.batchId));
      this.batchVar.selectedEmp = batchObj.employeeIds;
      this.batchVar.batchFrom=batchObj.fromDate;
      this.batchVar.batchTo = batchObj.toDate;
      this.batchVar.batchName=batchObj.batchName;
      this.batchVar.moduleForm=batchObj.moduleDetails;
      }
    });
  }

  onEmpSelect(item: any) {
    this.batchVar.employeeId =  this.batchVar.selectedEmp.map(item=>{return item.userId});
    this.batchVar.empValidate= false;
  }
  
    //Employee dropdown Settings configuration
    mySettings = {
      singleSelection: false,
      idField: 'userId',
      textField: 'department',
      enableCheckAll : false,
      itemsShowLimit: 8,
    }

    splitDate(date){
      const newDate = new Date(date);
      const y = newDate.getFullYear();
      const d = newDate.getDate();
      const month = newDate.getMonth();
      const h = newDate.getHours();
      const m = newDate.getMinutes();
      return new Date(y,month,d, h, m);
    }

    fromDateChange(date){
     let fromDate=date.toISOString();
     this.batchVar.batchFrom=fromDate;
    }

    toDateChange(date){
      let toDate=date.toISOString();
      this.batchVar.batchTo= toDate; 
    }
   
    //submit batch
   addBatch(form){

      this.batchVar.empValidate= this.batchVar.employeeId ? false : true;
      this.batchVar.dategreater= Date.parse(this.batchVar.batchFrom) >= Date.parse(this.batchVar.batchTo) ? true : false;
      let toastrMsg = this.batchVar.batchId ? this.batchVar.batchErrMsg :this.batchVar.batchSuccessMsg ;

      //To find duplicate module selection
      let moduleId = this.batchVar.moduleForm.map(function(item){ return item.moduleId });
      moduleId.sort();
      let last = moduleId[0]; 
      if(moduleId.length > 1){
          for (let i=1; i<moduleId.length; i++) {
            this.batchVar.moduleDuplicate =  (moduleId[i] == last) ? true : false;
          }
      }

      if(!this.batchVar.moduleDuplicate && this.batchVar.batchFrom && this.batchVar.batchTo && this.batchVar.batchName && this.batchVar.employeeId && this.batchVar.moduleForm){
          let postData={
           FromDate      : this.datePipe.transform(this.batchVar.batchFrom, 'yyyy-mm-dd hh:mm'),
           ToDate        : this.datePipe.transform(this.batchVar.batchTo, 'yyyy-mm-dd hh:mm'),
           EmployeeIds   : this.batchVar.employeeId,
           BatchName     : this.batchVar.batchName,
           ModuleDetails : this.batchVar.moduleForm
         }

         //this.toastr.success(toastrMsg);
         this.alertService.success(toastrMsg);
         this.router.navigateByUrl('/calendar');
         this.clearBatchForm();
        }
      }  
   

   clearBatchForm(){
    this.batchVar.moduleForm = [{
        moduleId : 1,
        moduleName:'',
        passpercentage:"null",
        mandatory :"true",
     }];
     this.batchVar.batchFrom = '';
     this.batchVar.batchTo = '';
     this.batchVar.selectedEmp ='';
     this.batchVar.batchName = '';
     this.router.navigateByUrl('/calendar');
   }

   //dynamic add module fields 
   addForm(){
     let obj={
            moduleId : 1,
            moduleName:'',
            passpercentage:"null",
            mandatory :"true",
     };
     this.batchVar.moduleForm.push(obj);
   }

   //dynamic remove module fields
  removeForm(i){
    this.batchVar.moduleForm.splice(i, 1);   
  }
  

   
}
