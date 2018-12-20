import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { HttpService } from '../../services/http.service';
import { VideosTrendVar } from '../../Constants/videostrend.var';
import { ActivatedRoute, Params } from '@angular/router';
import { ExcelService } from '../../services/excel.service';
import { PDFService } from '../../services/pdf.service';
import { API_URL } from 'src/app/Constants/api_url';

@Component({
    selector: 'app-videostrend-details',
    templateUrl: './videostrend-details.component.html',
    styleUrls: ['./videostrend-details.component.css'],
})

export class VideosTrendDetailsComponent implements OnInit {

    CourseTrendList;
    constructor(private headerService: HeaderService, private excelService: ExcelService, private pdfService: PDFService, private activatedRoute: ActivatedRoute, private trendsVar: VideosTrendVar, private http: HttpService) {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.trendsVar.videoId = params['id'];
        });
        this.trendsVar.url = API_URL.URLS;
    }

    ngOnInit() {
        this.headerService.setTitle({ title: this.trendsVar.title, hidemodule: false });
        this.http.get(this.trendsVar.url.getVideoTrendEmpList).subscribe((data) => {
            if (data.isSuccess === true) {
                const respData = data.CourseTrendList;
                if (this.trendsVar.videoId) {
                    respData.forEach((num, index) => {
                        if (num.videoId == this.trendsVar.videoId) {
                            this.trendsVar.filterEmployeeList.push(respData[index]);
                        }
                    });
                }
            }
        });
    }

    // Create PDF
    exportAsPDF() {
        var data = document.getElementById('contentToConvert'); 
        this.pdfService.htmlPDFFormat(data, this.trendsVar.pdfExcelTitle);  
        // this.CourseTrendList = this.trendsVar.filterEmployeeList[0].employeeDetails;
        // this.trendsVar.exportTo = this.trendsVar.pdf;
        // let header = ["S.no", "Employee Name", "Status", "View Date", "Completed Date"]
        // let data = this.CourseTrendList.map((items, i) => {
        //     let pdfArr = [
        //         i + 1, items.employeeName, items.status, items.viewDate, items.completedDate
        //     ]
        //     return pdfArr
        // });
        // this.pdfService.exportAsPDFFile(header,data,this.trendsVar.title);
    }

    // Create Excel sheet
    exportAsXLSX(): void {
        this.excelService.exportAsExcelFile(this.trendsVar.filterEmployeeList[0].employeeDetails, this.trendsVar.pdfExcelTitle);
    }

}
