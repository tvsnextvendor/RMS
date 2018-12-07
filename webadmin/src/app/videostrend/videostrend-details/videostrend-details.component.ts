import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {HttpService} from '../../services/http.service';
import {VideosTrendVar} from '../../Constants/videostrend.var';
import { ActivatedRoute, Params } from '@angular/router';
import {ExcelService} from '../../services/excel.service';
import {PDFService} from '../../services/pdf.service';

@Component({
    selector: 'app-videostrend-details',
    templateUrl: './videostrend-details.component.html',
    styleUrls: ['./videostrend-details.component.css'],
})

export class VideosTrendDetailsComponent implements OnInit {

    videoId;
    videosTrend;
    filterEmployeeList=[];
   constructor(private headerService:HeaderService,private excelService:ExcelService, private pdfService:PDFService ,private activatedRoute:ActivatedRoute,private trendsVar: VideosTrendVar ,private http: HttpService){
    this.activatedRoute.params.subscribe((params: Params) => {
        this.videoId = params['id'];
    })
   }

   ngOnInit(){

    this.headerService.setTitle('Videos Trend');
    this.http.get('5c08e0a12f00005400637aa6').subscribe((data) => {
        const respData = data;
        if(this.videoId){
          respData.forEach((num, index) => {
              if(num.videoId == this.videoId){              
                this.filterEmployeeList.push(respData[index]);
                }
             });
         }
     console.log(this.filterEmployeeList,"YAYYYYY");
   });
   
   }

   
 // Create PDF
 exportAsPDF(){  
    var data = document.getElementById('contentToConvert'); 
    this.pdfService.exportAsPDFFile(data, 'Videos Trend');  
  } 
  // Create Excel sheet
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.filterEmployeeList[0].employeeDetails, 'Videos Trend' );
  }

}
