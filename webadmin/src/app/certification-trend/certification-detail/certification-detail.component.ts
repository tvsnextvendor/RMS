import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService, BreadCrumbService, HeaderService, UtilService } from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var'



@Component({
  selector: 'app-certification-detail',
  templateUrl: './certification-detail.component.html',
  styleUrls: ['./certification-detail.component.css']
})
export class CertificationDetailComponent implements OnInit {
 
 courseId;
 badgeList;
 resortId;
 
 totalLength;
 
  constructor(public activatedRoute: ActivatedRoute,private commonService: CommonService, public commonLabels: CommonLabels, private breadCrumbService: BreadCrumbService, private headerService: HeaderService, private utilService: UtilService) { 
    this.activatedRoute.params.subscribe((params: Params) => {
        this.courseId = params.id ? params.id : '';
    });
  
  }

  ngOnInit() {
    this.headerService.setTitle({ title: this.commonLabels.labels.certifiTrend, hidemodule: false });
    this.breadCrumbService.setTitle([]);
    this.resortId = this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
    this.getBadgeList();
  }

  getBadgeList(){
     let query={
       courseId : this.courseId,
       resortId : this.resortId 
      }
    this.commonService.certificateTrendCountDetail(query).subscribe((res) => {
        if (res.isSuccess) {
            this.badgeList = res.data.rows.length ? res.data.rows : [];
            //this.calculateAvgScore(this.badgeList);
        } else {
            this.badgeList = [];
        }
        console.log(this.badgeList);
    });
  }

  calculateAvgScore(data){
   var score = 0;
   var avgScore = 0;
   var totalLength = 0;
    data.map(item=>{
      totalLength = data.length;
      score += parseInt(item.TrainingClass.FeedbackMappings[0].passPerc);
    })

    avgScore = score / totalLength;
    console.log(avgScore);
    return avgScore;

    // let score = 0;
    // console.log(tcMark,totalClass);
    //  score+=parseInt(tcMark);
    // console.log(score,"SCORE");
    // let avgScore;
    // avgScore = score/totalClass;
    // console.log(avgScore, "AVGSCORE");
    // return avgScore;
  }

}
