import { Component, OnInit } from '@angular/core';
import { CommonService ,BreadCrumbService,HeaderService} from '../services';
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
  search;
  trendList=[];


 
  constructor(public location:Location,private commonService: CommonService, public commonLabels: CommonLabels,private breadCrumbService :BreadCrumbService,private headerService : HeaderService) {
    this.pageLimitOptions = [5, 10, 25];
    this.pageLimit = [this.pageLimitOptions[0]];
    
   }

  ngOnInit() {
    this.headerService.setTitle({title: this.commonLabels.labels.certifiTrend, hidemodule: false});
    this.breadCrumbService.setTitle([]);
    this.getTrendList();
  }

  getTrendList() {
    let query = this.search ? "?search="+this.search : '';
          this.commonService.getCertificateTrendList(query).subscribe((res) => {
            if(res.isSuccess){
              this.trendList = res.data.rows.length ? res.data.rows : [];
            }
        });
    }

    ngOnDestroy(){
      this.search = '';
    }
    resetSearch(){
      this.search = '';
      this.getTrendList();
    }

    onPrint(){
      window.print();
    }

}
