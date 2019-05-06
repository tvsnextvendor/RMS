import { Injectable } from '@angular/core';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

@Injectable({ providedIn: 'root' })

export class BatchVar{
   //Employee dropdown Settings configuration
    departmentSettings = {
        singleSelection: false,
        idField: 'departmentId',
        textField: 'departmentName',
        enableCheckAll: false,
        itemsShowLimit: 8,
    }
    resortSettings = {
        singleSelection: false,
        idField: 'resortId',
        textField: 'resortName',
        enableCheckAll: false,
        itemsShowLimit: 8,
    }
    empSettings = {
        singleSelection: false,
        idField: 'userId',
        textField: 'userName',
        enableCheckAll: false,
        itemsShowLimit: 8,
    }
    divisionSettings = {
        singleSelection: false,
        idField: 'divisionId',
        textField: 'divisionName',
        enableCheckAll: false,
        itemsShowLimit: 8,
    }

   labels = {
        
    };
    calLabels = {
     
    };
    btns={
      
    };
    mandatoryLabels = {
      
    };
     
 
    
    
    calendarView = 'Calendar View';
    batchSuccessMsg = 'Training Schedule Added Successfully';
    batchErrMsg = 'Training Schedule Updated Successfully';
    // invalidModule = 'Invalid Program Selection';
    // select = 'Select';
    // resort= 'Resort';
    dategreater=false;
    empValidate=false;
    moduleDuplicate= false;
    resortList: IMultiSelectOption[];
    divisionList: IMultiSelectOption[];
    departmentList: IMultiSelectOption[];
    employeeList: IMultiSelectOption[];
    selectedEmp = [];
    selectedResort=null;
    selectedDivision =[];
    selectedDepartment=[];
     moduleForm = [];
     moduleList;
     programList;
     percentageList;
     url;
     batchFrom;
     batchTo;
     min;
     employeeId;
     resortId;
     divisionId;
     departmentId;
     batchName;
     batchList;
     batchId;
     regDuration=[
         {"id":1,"name":"minutes"},
         {"id":2,"name":"hours"},
         {"id":3,"name":"days"}
     ];
     modalRef;
     modalConfig;
}