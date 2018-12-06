import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas';
import {HttpService} from '../services/http.service';
import {ExcelService} from '../services/excel.service';
import {PDFService} from '../services/pdf.service';
import {HeaderService} from '../services/header.service';
import {EmployeeVar} from '../Constants/employee.var';

@Component({
  selector: 'app-employeedetails',
  templateUrl: './employeedetails.component.html',
  styleUrls: ['./employeedetails.component.css']
})
export class EmployeedetailsComponent implements OnInit {

  employeeArray = [];
  employeeName = '';
  labels;

  constructor(private route: Router, private toastr: ToastrService,private http: HttpService,private excelService:ExcelService,private employeeVar : EmployeeVar,private pdfService:PDFService,private headerService: HeaderService) { }

  ngOnInit(){
    // get employee status
    this.http.get('5c07d5963000006117d25d6f').subscribe((resp) => {
      this.employeeArray = resp.EmployeeDetailList;
      this.employeeName = resp.EmployeeName
    });
    this.labels = this.employeeVar.employeeDetails;
    this.headerService.setTitle(this.labels.title);
  }

 // Create PDF
 exportAsPDF(){  
  var data = document.getElementById('contentToConvert'); 
  this.pdfService.exportAsPDFFile(data, this.labels.title);  
} 
// Create Excel sheet
exportAsXLSX():void {
  this.excelService.exportAsExcelFile(this.employeeArray, this.labels.title);
}

}
