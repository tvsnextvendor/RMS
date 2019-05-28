import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,Params } from '@angular/router';

@Component({
  selector: 'app-cms-page',
  templateUrl: './cms-page.component.html',
  styleUrls: ['./cms-page.component.css']
})
export class CmsPageComponent implements OnInit {

  constructor(private route: Router,private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  pageRedirection(type,data){
    // this.activeType = type+data;
    // console.log(this.activeType)
    this.route.navigate(['/cms-library'],{queryParams:{type : type,tab : data}})
  }

}
