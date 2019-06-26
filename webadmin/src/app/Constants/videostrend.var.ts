import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VideosTrendVar {
   videosTrendLabels = {
    //    courseTitle    : 'Course Name',
    //    uploadedDate   : 'Uploaded Date',
    //    modifiedDate   : 'Modified Date',
    //    noOfResorts    : 'No. of Resorts',
    //    noOfEmployees  : 'No. of Employees'
   };

   videosTrendDetailsLabels = {
       courseName   : 'Course Name',
       videoName    : 'Video Name',
       uploadedDate : 'Uploaded Date',
       totalEmployees : 'Total No of Employees'
   };
   empTableTitle = {
    //    empName       : 'Employee Name',
    //    resortName    : 'Resort Name',
    //    status        : 'Status',
    //    assignedDate  : 'Assigned Date',
    //    completedDate : 'Completed Date'
   };

   exportTo   = 'Export To';
   excel      = 'Excel';
   select     = 'Select';
   pdf        = 'PDF';
   noData     = 'No Data';
//    title      = 'Course Trend';
   pdfExcelTitle = 'Course Trend';
   yearsList = [{'year': '2017'}, {'year': '2018'}, {'year': '2019'}];
   monthsList = [{'id': '1', 'month': 'JAN'}, {'id': '2', 'month': 'FEB'}, {'id': '3', 'month': 'MAR'}, {'id': '4', 'month': 'APR'},
    {'id': '5', 'month': 'MAY'}, {'id': '6', 'month': 'JUN'},{'id': '7', 'month': 'JUL'}, {'id': '8', 'month': 'AUG'}, {'id': '9', 'month': 'SEP'}, {'id': '10', 'month': 'OCT'}, {'id': '11', 'month': 'NOV'}, {'id': '12', 'month': 'DEC'}];
   employeeList = [];
   years = '';
   months = '';
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