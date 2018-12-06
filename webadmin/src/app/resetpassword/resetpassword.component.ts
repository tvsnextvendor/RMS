import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {HttpService} from '../services/http.service'


@Component({
  selector: 'app-reset',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['../login/login.component.css'],
})
export class ResetpasswordComponent implements OnInit {

  resetFormData = {
    id: '',
    password: ''
  };
  confirmPwd = '';
  userArray = [];
  userId;
  constructor(private route: ActivatedRoute,private router: Router, private toastr: ToastrService,public http : HttpService) { }

  ngOnInit() {
    // get user details
    this.http.get('5c01283c3500005d00ad085b').subscribe((resp) => {
      this.userArray = resp;
    });
    let encId = this.route.snapshot && this.route.snapshot.params && this.route.snapshot.params.id;
    this.userId = atob(encId);

  }
// reset function
  submitResetPassword() {
    if (this.resetFormData.password === this.confirmPwd) {
      this.toastr.success('Password Resetted Successfully');
      this.router.navigateByUrl('/login');
     // return false;


      let updatedArray = this.userArray.map((item,index)=>{
       // debugger;
        if(index === parseInt(this.userId)){
          debugger;
          item.password = this.resetFormData.password
        }
        return item;
      })
     // console.log(updatedArray);
      this.http.post('5c01283c3500005d00ad085b',updatedArray).subscribe((resp) => {
         console.log(resp);
      });
    } else {
      this.toastr.error('Password Mismatch');
    }
  }
}
