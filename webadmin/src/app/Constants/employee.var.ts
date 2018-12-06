import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EmployeeVar {
    employeeStatus = {
        "title" : "Employee Status",
        "exportTo" : "Export to",
        "noData" : "No Data!",
        "btns" : {
            "excel" : "Excel",
            "pdf" : "PDF"
        },
        "tableTitle" : {
            "employeeName" : "Employee Name",
            "employeeGroup" : "Employee Group",
            "assignedCount" : "Assigned",
            "inProgressCount" : "In progress",
            "completedCount" : "Completed",
            "ratings" : "Ratings",
            "total" : "Total"
        }
    };
    employeeDetails = {
        "title" : "Employee Details",
        "exportTo" : "Export to",
        "noData" : "No Data!",
        "employeeName" : "Employee Name",
        "btns" : {
            "excel" : "Excel",
            "pdf" : "PDF"
        },
        "tableTitle" : {
            "courseName" : "Course Name",
            "percentageCompleted" : "% Completed",
            "badgeName" : "Badge Name",
            "videoName" : "Video Name",
            "status" : "Status",
            "assignedDate" : "Assigned Date",
            "viewedDate" : "Viewed Date",
            "completedDate" : "Completed Date"
        }
    };
}
