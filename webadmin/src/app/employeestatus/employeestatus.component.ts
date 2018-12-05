import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas';
import {HttpService} from '../services/http.service';
import {ExcelService} from '../services/excel.service';
import {HeaderService} from '../services/header.service';


@Component({
  selector: 'app-employeestatus',
  templateUrl: './employeestatus.component.html',
  styleUrls: ['./employeestatus.component.css']
})
export class EmployeestatusComponent implements OnInit {
  employeeArray = [];

  constructor(private route: Router, private toastr: ToastrService,private http: HttpService,private excelService:ExcelService,private headerService: HeaderService) { }

  ngOnInit(){
    // get employee status
    this.http.get('5c061e773300000f27e81450').subscribe((resp) => {
      this.employeeArray = resp;
    });

    this.headerService.setTitle('Employee Status');
  }

  captureScreen() 
  {  
    var data = document.getElementById('contentToConvert');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });  
  } 

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.employeeArray, 'Employee_details');
  }
}
