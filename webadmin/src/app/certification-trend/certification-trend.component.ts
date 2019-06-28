import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services';
import { CommonLabels } from '../Constants/common-labels.var'
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-certification-trend',
  templateUrl: './certification-trend.component.html',
  styleUrls: ['./certification-trend.component.css']
})
export class CertificationTrendComponent implements OnInit {
 
  pageLimitOptions;
  pageLimit;
  trendList=[];


 
  constructor(private location:Location,private commonService: CommonService, private commonLabels: CommonLabels) {
    this.pageLimitOptions = [5, 10, 25];
    this.pageLimit = [this.pageLimitOptions[0]];
    
   }

  ngOnInit() {
    this.getTrendList();
  }

  getTrendList() {
          this.commonService.getCertificateTrendList().subscribe((res) => {
            if(res.isSuccess){
            this.trendList = res.data;
            }
        });
    }

}
