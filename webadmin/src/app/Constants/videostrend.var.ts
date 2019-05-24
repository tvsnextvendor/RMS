import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VideosTrendVar {
   videosTrendLabels = {
       courseTitle    : 'Course Name',
       uploadedDate   : 'Uploaded Date',
       modifiedDate   : 'Modified Date',
       noOfResorts    : 'No. of Resorts',
       noOfEmployees  : 'No. of Employees'
   };

   videosTrendDetailsLabels = {
       courseName   : 'Course Name',
       videoName    : 'Video Name',
       uploadedDate : 'Uploaded Date',
       totalEmployees : 'Total No of Employees'
   };
   empTableTitle = {
       empName       : 'Employee Name',
       resortName    : 'Resort Name',
       status        : 'Status',
       assignedDate  : 'Assigned Date',
       completedDate : 'Completed Date'
   };

   exportTo   = 'Export To';
   excel      = 'Excel';
   select     = 'Select';
   pdf        = 'PDF';
   noData     = 'No Data';
   title      = 'Course Trend';
   pdfExcelTitle = 'Course Trend';
   yearsList = [{'year': '2017'}, {'year': '2018'}, {'year': '2019'}];
   monthsList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
   employeeList = [];
   years = '2019';
   months = '5';
   backBtn = 'Back';
   videosTrend;
   moduleList: any = [];
   moduleType = null;
   pageLimitOptions = [];
   pageLimit;
   videoId;
   filterEmployeeList = [];
   url;

}