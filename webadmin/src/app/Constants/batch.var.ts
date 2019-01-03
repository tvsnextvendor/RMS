import { Injectable } from '@angular/core';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

@Injectable({ providedIn: 'root' })

export class BatchVar{

   labels = {
        from       : 'From',
        to         : 'To',
        batchName  : 'Training Class',
        selectDept  : 'Department',
        module     : 'Program',
        mandatory  : 'Mandatory',
        optional   : 'Optional',
        percentage : 'Pass %',
        courses    : 'Courses'        
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
         from         : 'From date is required.',
         to           : 'To date is required.',
         batchName    : 'Training Class is required.',
         selectDept   : 'Department is required.',
         dateValidate : 'From date should be less than To Date.',
         passpercentage : 'Pass Percentage is required.'         
    };
     
    title = 'Add New Training Class';
    editTitle = 'Edit New Training Class';
    calendarTitle = 'Training Class Calendar';
    calendarView = 'Calendar View';
    batchSuccessMsg = 'Training Class Added Successfully';
    batchErrMsg = 'Training Class Updated Successfully';
    invalidModule = 'Invalid Program Selection';
    select = 'Select';
    dategreater=false;
    empValidate=false;
    moduleDuplicate= false;
    employeeList: IMultiSelectOption[];
    selectedEmp;
    moduleList;
    programList;
    percentageList;
    url;
    moduleForm = [{
        moduleId : 1,
        program: "null",
        passpercentage:"null",
        mandatory :"true",
     }];
     batchFrom;
     batchTo;
     min;
     employeeId;
     batchName;
     batchList;
     batchId;
}