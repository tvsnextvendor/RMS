import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EmailVar {
    emailLabels = {
      name        :  'Name',
      dob         :  'Dob',
      email       :  'Email',
      mobile      :  'Mobile',
      designation :  'Designation',
      dept        :  'Department'
    };
    btns = {
        save        : 'SAVE',
        editProfile : 'Edit Profile'
     };
     mandatoryLabels ={
         name        : 'Name is required',
         email       : 'Email is required',
         mobile      : 'Mobile Number is required',     
         designation : 'Designation is required',
         dept        : 'Department is required'  
     };
     successMsg='Email Sent Successfully';
     title= 'Email';
     userName;
     dob;
     dept;
     designation;
     mobile;
     email;
     split_url;
     hideProfile=false;
     hideEditProfile=true;
    
}