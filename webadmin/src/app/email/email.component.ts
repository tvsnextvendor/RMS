import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from '../services/header.service';
import { HttpService } from '../services/http.service';
import { EmailVar } from '../Constants/email.var';
import { API_URL } from '../Constants/api_url';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.css'],
})

export class EmailComponent implements OnInit {
     email:any={};
     emailForm:any={'to':'','cc':'','subject':''};
     departments:any=[];
    constructor(private toastr:ToastrService,private headerService:HeaderService,private emailVar:EmailVar,private http: HttpService){
        this.email.url = API_URL.URLS;
     }

    ngOnInit(){
        this.headerService.setTitle({title:this.emailVar.title, hidemodule:false});
        this.departmentList();

    }
    departmentList(){
        this.http.get(this.email.url.getDepartments).subscribe((resp) => {
            this.departments = resp['DepartmentList'];
        });
    }
}