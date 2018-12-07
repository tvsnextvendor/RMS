import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {HttpService} from '../services/http.service';
import {HeaderService} from '../services/header.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']

})
export class GroupComponent implements OnInit {
 
  groupArray = [];
  employeeArray = [];
  labels ;
  file;
  imagePreviewUrl;
  groupName;
  description;
  editKey = false;
  employeeId = [];
  dropdownList = [];
  employeeOptions = [];
  selectedValues = [];
  dropDownConfig = {};

  constructor(private route: Router, private toastr: ToastrService,private http: HttpService,private headerService: HeaderService) { }

  ngOnInit(){
    // get group list
    this.http.get('5c08ddb82f0000c11f637a99').subscribe((resp) => {
      this.groupArray = resp.groupDetails;
    });

    // get employee list
    this.http.get('5c0928d52f0000c21f637cd0').subscribe((resp) => {
      this.dropdownList = resp.employeeList;
      this.employeeOptions = resp.employeeList.map(item=>{
        return item.name;
      });
    });

    // dropdown config
    this.dropDownConfig = {placeholder : 'Select employee',displayKey:'selectedValues',search:true,noResultsFound: 'No results found!',height: '195px',
    searchPlaceholder:'Search by employee'
    };
    // this.labels = this.employeeVar.employeeStatus;
    this.headerService.setTitle("Groups");
  }
  editGroup(data){
    console.log(data)
    let empName = [];
    if(data){
      this.editKey = true;
      this.groupName = data.groupName;
      this.description = data.groupDescription;
      data.employeeId.forEach(item=>{
        this.dropdownList.forEach(data=>{
          debugger;
          if(item === data.id){
            empName.push(data.name);
          }
        })
      })
    }
    this.selectedValues = empName;
    console.log(this.selectedValues)
  }

   // image reader for upload
   onhandleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
        this.file =  file,
        this.imagePreviewUrl  =  reader.result
    }
  reader.readAsDataURL(file)
  }

  onEmployeeChange(){
    let ids=[];
    if(this.selectedValues.length){
      this.selectedValues.forEach(item=>{
        this.dropdownList.forEach(data=>{
          if(item === data.name){
            ids.push(data.id);
          }
        })
      })
    }
    console.log(ids)
    this.employeeId = ids;
  }

  statusUpdate(groupName,status){
    let statusName = status ? "is Activated" : "is Deativated"
    this.toastr.success(groupName +" group "+ statusName);
  }

  onSubmitForm(data){
    console.log(data);
    if(data.groupName && data.description && this.selectedValues.length){
      if(this.editKey){
        this.toastr.success("Data updated sucessfully");
      }
      else{
        this.toastr.success("Data created sucessfully");
      }
      this.clearForm();
    }
    else{
      this.toastr.warning("Invalid data");
    }
  }

  clearForm(){
    this.groupName = '';
    this.description = '';
    this.selectedValues = [];
    this.employeeId = [];
    this.editKey = false;
  }
}

