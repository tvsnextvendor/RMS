import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {HttpService} from '../../services/http.service';
import {VideosTrendVar} from '../../Constants/videostrend.var';
import { ActivatedRoute, Params } from '@angular/router';
import {ExcelService} from '../../services/excel.service';
import {PDFService} from '../../services/pdf.service';
import { API_URL } from 'src/app/Constants/api_url';

@Component({
    selector: 'app-videostrend-details',
    templateUrl: './videostrend-details.component.html',
    styleUrls: ['./videostrend-details.component.css'],
})

export class VideosTrendDetailsComponent implements OnInit {

    
    constructor(private headerService:HeaderService,private excelService:ExcelService, private pdfService:PDFService ,private activatedRoute:ActivatedRoute,private trendsVar: VideosTrendVar ,private http: HttpService){
    this.activatedRoute.params.subscribe((params: Params) => {
        this.trendsVar.videoId = params['id'];
    });
    this.trendsVar.url=API_URL.URLS;
   }

   ngOnInit(){

    this.headerService.setTitle({title:"Course Trend", hidemodule:false});
    this.http.get(this.trendsVar.url.getVideoTrendEmpList).subscribe((data) => {
        if(data.isSuccess === true){

            const respData = data.CourseTrendList;
            if(this.trendsVar.videoId){
              respData.forEach((num, index) => {
                  if(num.videoId == this.trendsVar.videoId){              
                    this.trendsVar.filterEmployeeList.push(respData[index]);
                    }
                 });
             }

        }

       
        });
       }

// Create PDF
 exportAsPDF(){  
    var data = document.getElementById('contentToConvert'); 
    this.pdfService.exportAsPDFFile(data, 'Videos Trend');  
  } 

  // Create Excel sheet
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.trendsVar.filterEmployeeList[0].employeeDetails, 'Videos Trend' );
  }

}
