import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../services/header.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// declare var $;

@Component({
  selector: 'app-cms-library',
  templateUrl: './cms-library.component.html',
  styleUrls: ['./cms-library.component.css']
})
export class CMSLibraryComponent implements OnInit {

  constructor(private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.setTitle({ title: 'CMS Library', hidemodule: false });
    
  }

}
