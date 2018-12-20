import { Component, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import { HeaderService} from '../services/header.service';
import { ToastrService } from 'ngx-toastr';
import { HttpService} from '../services/http.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserVar } from '../Constants/user.var';
import { API_URL } from '../Constants/api_url';

@Component({
    selector: 'app-users',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
})

export class UserComponent implements OnInit {

   modalRef:BsModalRef;
   constructor(private http: HttpService,private constant:UserVar,private modalService:BsModalService,private headerService:HeaderService,private toastr:ToastrService,private router:Router){
       this.constant.url = API_URL.URLS;
   }
   ngOnInit(){
    this.headerService.setTitle({ title:this.constant.title, hidemodule: false});
    
    //get Users list
    this.http.get(this.constant.url.getUsers).subscribe((data) => {
        if(data['isSuccess']){
            this.constant.userList = data.UserList;
        }
    });
 
   }

  

  
 
 
  
 
 


 




  
}
