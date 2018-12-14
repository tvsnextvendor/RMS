import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {HttpService} from '../../services/http.service';
import {ExcelService} from '../../services/excel.service';
import {PDFService} from '../../services/pdf.service';
import {HeaderService} from '../../services/header.service';
import {EmployeeVar} from '../../Constants/employee.var';
import { API_URL } from '../../Constants/api_url';

@Component({
  selector: 'app-employeestatus',
  templateUrl: './employeestatus.component.html',
  styleUrls: ['./employeestatus.component.css']
})
export class EmployeestatusComponent implements OnInit {
  employeeArray = [];
  labels ;
  pageLimitOptions = [];
  pageLimit;
  filterOptions = [];
  selecetedFilter;
  hidemodule = true;
  apiUrls;
  constructor(private route: Router, private toastr: ToastrService,private http: HttpService,private employeeVar : EmployeeVar,private excelService:ExcelService,private pdfService:PDFService,private headerService: HeaderService,private apiUrl:API_URL) {
    this.apiUrls=API_URL.URLS;
   }

  ngOnInit(){
    // get employee status
    this.http.get(this.apiUrls.getEmployeeStatus).subscribe((resp) => {
      this.employeeArray = resp.EmployeeList;
    });
    this.labels = this.employeeVar.employeeStatus;
    this.headerService.setTitle({title:this.labels.title, hidemodule: this.hidemodule });
    this.pageLimitOptions = [5, 10, 25];
    this.pageLimit=[this.pageLimitOptions[0]];
    this.filterOptions = ["HR","Finance","Marketing","Safety"];
  }

  onLimitChange(){
    console.log(this.pageLimit);
  }
// Create PDF
  exportAsPDF(){  
    this.labels.btns.select =  this.labels.btns.pdf;
    var data = document.getElementById('contentToConvert'); 
    this.pdfService.exportAsPDFFile(data, this.labels.title);  
  } 
  goToEmpDetails(){
    this.route.navigateByUrl('/employeedetails');
  }
// Create Excel sheet
  exportAsXLSX():void {
    this.labels.btns.select =  this.labels.btns.excel;
    this.excelService.exportAsExcelFile(this.employeeArray, this.labels.title);
  }
}
