import { Component, OnInit } from '@angular/core';
import { CommonService, BreadCrumbService, HeaderService, UtilService } from '../services';
import { CommonLabels } from '../Constants/common-labels.var'
import { VideosTrendVar } from '../Constants/videostrend.var';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-certification-trend',
  templateUrl: './certification-trend.component.html',
  styleUrls: ['./certification-trend.component.css']
})
export class CertificationTrendComponent implements OnInit {

  pageLimitOptions;
  pageLimit;
  search;
  trendList = [];
  resortId;
  constructor(public location: Location, private commonService: CommonService, public commonLabels: CommonLabels, private breadCrumbService: BreadCrumbService, private headerService: HeaderService, private utilService: UtilService,public trendsVar: VideosTrendVar) {
    this.pageLimitOptions = [5, 10, 25];
    this.pageLimit = [this.pageLimitOptions[0]];
  }
  ngOnInit() {
    this.headerService.setTitle({ title: this.commonLabels.labels.certifiTrend, hidemodule: false });
    this.breadCrumbService.setTitle([]);
    this.resortId = this.utilService.getUserData() && this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
    this.getTrendCountList();
  }
  // getTrendList() {
  //   let query = this.search ? "?search=" + this.search : '';
  //   this.commonService.getCertificateTrendList(query).subscribe((res) => {
  //     if (res.isSuccess) {
  //       this.trendList = res.data.rows.length ? res.data.rows : [];
  //     }
  //   });
 // }
  
  getTrendCountList() {
    let query = this.resortId ? "?resortId=" + this.resortId : '';
    this.search ? query + "&search=" + this.search : '';
    this.commonService.certificateTrendCount(query).subscribe((res) => {
      if (res.isSuccess) {
        this.trendList = res.data.rows.length ? res.data.rows : [];
      } else {
        this.trendList = [];
      }
      // console.log(this.trendList);
    });
  }

  ngOnDestroy() {
    this.search = '';
  }
  resetSearch() {
    this.search = '';
    this.getTrendCountList();
  }
  onPrint() {
    window.print();
  }
}
