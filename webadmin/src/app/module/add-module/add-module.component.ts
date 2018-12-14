import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';

@Component({
    selector: 'app-add-module',
    templateUrl: './add-module.component.html',
    styleUrls: ['./add-module.component.css'],
})

export class AddModuleComponent implements OnInit {

    dropdownSettings;
    moduleForm: any[] = [{
        moduleId:1,
        moduleName:'',
        quiz:"true",
        batchList : [
            {id : 1,Value:"Batch 1"},
            {id : 2,Value:"Batch 2"},
            {id : 3,Value:"Batch 3"},
            {Id : 4,Value:"Batch 4"}
          ],
          selectedItems:[
            {id : 2,Value:"Batch 2"},
            {id: 3,Value:"Batch 3"}
          ]
    }];


   constructor(private headerService:HeaderService){}

   ngOnInit(){
    // this.headerService.setTitle('Settings');
    this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'Value',
        itemsShowLimit: 5,
        allowSearchFilter: false
      };
   }

   addModule(){
       let obj={
           moduleId:1,
           moduleName:'',
           quiz: 'true'
       };
       obj.moduleId=obj.moduleId+1;
    this.moduleForm.push(obj);
    console.log(this.moduleForm,"MODULEFORM");
   }
  
   removeModule(i){
    this.moduleForm.splice(i, 1);   
    console.log(this.moduleForm,"MODULEREMOVE");
 
   }

   submitForm(form){

   }

   onItemSelect(item: any) {
    console.log(item);
  }

}
