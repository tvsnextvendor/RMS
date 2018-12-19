import { Injectable } from '@angular/core';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

@Injectable({ providedIn: 'root' })

export class BatchVar{

   labels = {
        from       : 'From',
        to         : 'To',
        batchName  : 'Batch Name',
        selectEmp  : 'Select Employee',
        module     : 'Module'        
    };

    btns={
        clear  : 'CLEAR',
        create : 'CREATE',
        save   : 'SAVE'
    }
     
    title = 'Add New Batch';
    employeeList: IMultiSelectOption[];
    moduleList;
    percentageList;
    url;
    moduleForm = [{
        moduleId : 1,
        passpercentage:"null",
        mandatory :"true",
     }];
     batchFrom;
     batchTo;
     employeeId;
     batchName;
  
}