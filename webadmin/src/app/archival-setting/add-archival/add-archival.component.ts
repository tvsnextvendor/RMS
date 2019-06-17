import { Component, OnInit } from '@angular/core';
import { HeaderService, BreadCrumbService } from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var'

@Component({
    selector: 'app-archival-setting',
    templateUrl: './add-archival.component.html',
    styleUrls: ['./add-archival.component.css']
})
export class AddArchivalSettingComponent implements OnInit {

    constructor(private headerService: HeaderService, public commonLabels: CommonLabels, private breadCrumbService: BreadCrumbService) { }

    ngOnInit() {
        this.headerService.setTitle({ title: 'Archival Setting', hidemodule: false });
        this.breadCrumbService.setTitle([])
    }

}
