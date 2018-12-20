import { Injectable } from '@angular/core';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

@Injectable({ providedIn: 'root' })

export class BatchVar{

   labels = {
        from       : 'From',
        to         : 'To',
        batchName  : 'Batch Name',
        selectEmp  : 'Select Employee',
        module     : 'Module',
        mandatory  : 'Mandatory',
        optional   : 'Optional',
        percentage : 'Pass %'
    };
    calLabels = {
        next     : 'Next',
        today    : 'Today',
        previous : 'Previous',
        month    : 'Month',
        week     : 'Week',
        day      : "Day"
    };
    btns={
        clear  : 'CLEAR',
        create : 'CREATE',
        save   : 'SAVE'
    };
    mandatoryLabels = {
         from       : 'From date is required.',
         to         : 'To date is required.',
         batchName  : 'Batch Name is required.',
         selectEmp  : 'Employee is required.',
         dateValidate : 'From date should be less than To Date'
    };
     
    title = 'Add New Batch';
    calendarTitle = 'Training Batch Calendar';
    calendarView = 'Calendar View';
    dategreater=false;
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