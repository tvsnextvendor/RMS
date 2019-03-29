import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';  
import html2canvas from 'html2canvas';
import 'jspdf-autotable';


@Injectable({
    providedIn: 'root'
  })
export class PDFService {

  constructor() { }

    public exportAsPDFFile(header,data,PDFFileName: string): void {
        var doc = new jsPDF('p', 'pt');
        var col = header;
        var rows = data;
        var pageTitle = function(data) {
            doc.setFontSize(18);
            doc.setTextColor(40);
            doc.setFontStyle('normal');
            doc.text(PDFFileName, data.settings.margin.left, 50);
          };
        doc.autoTable(col, rows,{beforePageContent: pageTitle,margin: {top: 80}});
        doc.save(PDFFileName+'.pdf');
    }

    public htmlPDFFormat(data,PDFFileName: string): void {
        html2canvas(data).then(canvas => {  
            // Few necessary setting options  
            var imgWidth = 208;   
            var pageHeight = 295;    
            var imgHeight = canvas.height * imgWidth / canvas.width;  
            var heightLeft = imgHeight;  
        
            const contentDataURL = canvas.toDataURL('image/png')  
            let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
            var position = 15;
            pdf.text(2, 10, PDFFileName);
            pdf.addImage(contentDataURL, 'PNG', 1, position, imgWidth, imgHeight)  
            pdf.save(PDFFileName+'.pdf'); // Generated PDF   
        });  
    }
}