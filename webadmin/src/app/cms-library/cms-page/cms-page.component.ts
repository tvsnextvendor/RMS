import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,Params } from '@angular/router';
import {HeaderService} from '../../services/header.service';
import { CommonLabels } from '../../Constants/common-labels.var'

@Component({
  selector: 'app-cms-page',
  templateUrl: './cms-page.component.html',
  styleUrls: ['./cms-page.component.css']
})
export class CmsPageComponent implements OnInit {
  urlType;
  constructor(private route: Router,private activatedRoute: ActivatedRoute,private headerService :HeaderService,public commonLabels : CommonLabels) { }

  ngOnInit() {
    this.headerService.setTitle({title:this.commonLabels.titles.cmsLibrary, hidemodule:false});
    this.activatedRoute.queryParams.subscribe(params=>{
      console.log(params)
      this.urlType = params.type;
    })
  }

  pageRedirection(type,data){
    // this.activeType = type+data;
    // console.log(this.activeType)
    if(type == 'create' && data == 'quiz'){
      this.route.navigate(['/createQuiz'])
    }
    else{
      this.route.navigate(['/cms-library'],{queryParams:{type : type,tab : data}})
    }
  }

}
