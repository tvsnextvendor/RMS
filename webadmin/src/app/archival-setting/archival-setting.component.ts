import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-archival-setting',
  templateUrl: './archival-setting.component.html',
  styleUrls: ['./archival-setting.component.css']
})
export class ArchivalSettingComponent implements OnInit {

  constructor(private headerService:HeaderService) { }

  ngOnInit() {
    this.headerService.setTitle({title:'Archival Setting', hidemodule:false});
  }

}
