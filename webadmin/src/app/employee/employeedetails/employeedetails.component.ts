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
  selector: 'app-employeedetails',
  templateUrl: './employeedetails.component.html',
  styleUrls: ['./employeedetails.component.css']
})
export class EmployeedetailsComponent implements OnInit {
  employeeArray = [];
  employeeName = '';
  labels;
  hidemodule = false;
  apiUrls;
  constructor(private route: Router, private toastr: ToastrService,private http: HttpService,private excelService:ExcelService,private employeeVar : EmployeeVar,private pdfService:PDFService,private headerService: HeaderService,private apiUrl:API_URL) {this.apiUrls=API_URL.URLS; }

  ngOnInit(){
    // get employee status
    this.http.get(this.apiUrls.getEmployeeDetails).subscribe((resp) => {
      this.employeeArray = resp.EmployeeDetailList;
      this.employeeName = resp.EmployeeName
    });
    this.labels = this.employeeVar.employeeDetails;
    this.headerService.setTitle({title:this.labels.title, hidemodule: this.hidemodule});
  }

 // Create PDF
 exportAsPDF(){ 
  this.labels.btns.select =  this.labels.btns.pdf;
  var data = document.getElementById('contentToConvert'); 
  this.pdfService.exportAsPDFFile(data, this.labels.title);  
} 
// Create Excel sheet
exportAsXLSX():void {
  this.labels.btns.select =  this.labels.btns.excel;
  this.excelService.exportAsExcelFile(this.employeeArray, this.labels.title);
}

goToVideosTrend(id){
  this.route.navigateByUrl('/videostrend/'+id);
}

}
