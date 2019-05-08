import { Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {HttpService, AlertService, ForumService, UtilService} from '../../services';
import {ForumVar} from '../../Constants/forum.var';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from '../../Constants/api_url';
import { CommonLabels } from '../../Constants/common-labels.var';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import {Router} from '@angular/router';

@Component({
    selector: 'app-createForum',
    templateUrl: './createForum.component.html',
     styleUrls: ['./createForum.component.css']
})

export class CreateForumComponent implements OnInit {

    forumName;
    forumEditPage;
    topicsArray: Array<any> =  [{
      topics: '',
      forumTopicId: ''
    }];
    topics;
    successMessage;
    dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'value',
      enableCheckAll : false,
      itemsShowLimit: 8,
      // allowSearchFilter: true
    };
    admin = {};
    division = {};
    department = {};
    @Input() closeModal;
    departData;
    departmentList;
    adminData;
   
    
    

   constructor(
     private toastr: ToastrService,
    public forumVar: ForumVar,
    private forumService: ForumService,
    public alertService:AlertService,
    private datePipe: DatePipe,
    private router: Router,
    public commonLabels: CommonLabels,
    private utilService: UtilService) {
    this.forumVar.url = API_URL.URLS;
    this.forumVar.forumAdmin = '';

   }

   ngOnInit() {
    // this.department['departData'] = [];
    // this.department['departmentList'] =[];
    // this.admin['adminData'] =[];

     this.forumService.editForum.subscribe(result => {
      this.forumEditPage = result;
     });

    this.getAdminList();
    this.getDivisionList();
    if (this.forumEditPage.editPage) {
      this.getForumData();
     }
     
   }

   getForumData() {
      this.forumService.getForumById(this.forumEditPage.forumId).subscribe((result) => {
        const forumData = result.data.rows[0];
        this.division['divisionList'] = _.uniqBy(forumData['Divisions'].map(item => {
            const obj = {
              id: item['Division']['divisionId'] ,
              value: item['Division']['divisionName']
            };
            return obj;
        }), 'id');
        if (this.division['divisionList']) {
          this.getDepartmentList();
        }
        const selectedDepartment = forumData['Divisions'].map(item => {
          if (item['Department']) {
            const departObj =  {
              id: item['Department']['departmentId'] ,
              value: item['Department']['departmentName']
            };
            return _.omit(departObj, _.isUndefined);
          }
        });
        this.departmentList = selectedDepartment.filter(item => item);
        this.forumVar.forumName = forumData.forumName;
        this.topicsArray = forumData.Topics;
        this.forumVar.forumAdmin = forumData.forumAdmin;
        this.forumVar.startDate = new Date(forumData.startDate);
        this.forumVar.endDate = new Date(forumData.endDate);
     });
   }

   getAdminList() {
    this.forumService.getAdmin().subscribe((resp) => {
      this.adminData = resp.data['rows'].map(item => {
        const admin = {
            id: item.userId,
            value : item.userName
        };
        return admin;
      });
    });
  }

   getDepartmentList() {
     const selectedDivision = {
       divisionId: this.division['divisionList'] && this.division['divisionList'].map(item => item.id)
      };
   

    this.forumService.getDepartment(selectedDivision).subscribe((resp) => {
      this.department['departments'] = resp.data && resp.data['rows'];
        this.departData = this.department && this.department['departments'] && this.department['departments'].map(item => {
          const department = {
              id: item.departmentId,
              value : item.departmentName
          };
          return department;
        });
      });
 }

   getDivisionList() {
    this.forumService.getDivision().subscribe((resp) => {
        this.division['divisionData'] = resp.data['rows'].map(item => {
          const division = {
              id: item.divisionId,
              value : item.divisionName
          };
          return division;
        });
        if (this.division['divisionList']) {
          this.getDepartmentList();
        }
      });
    }

    addTopic(i, topic) {
      this.topicsArray.push({topics: ''});
    }

    removeTopic(i) {
      this.topicsArray.splice(i, 1);
    }

    onItemSelect(event, type) {
      if  (type === 'division') {
        this.getDepartmentList();
      }
    }

    onItemDeselect(event) {

    }

    checkNameUniqueness(forumName) {
      for (let i = 0; i <  this.forumVar.forumNameList.length; i++) {
        if (forumName && this.forumVar.forumNameList[i] === forumName) {
          this.forumVar.uniqueValidate = true;
          break;
        } else {
          this.forumVar.uniqueValidate = false;
        }
      }
    }

    onSubmitForm(form) {
      this.division['divisions'] = this.division['divisionList'].map(item => item.id);
      const selectedDepartments = this.departmentList;
      this.department['departments'] = this.department['departments'].filter(function(obj1) {
        return selectedDepartments.some(function(obj2) {
             return obj1.departmentId === obj2.id;
          });
        });
      if (form.valid && !this.forumVar.uniqueValidate ) {
        const postData = {
          forum: {
            forumName : this.forumVar.forumName,
            forumAdmin: this.forumVar.forumAdmin,
            startDate: this.datePipe.transform(this.forumVar.startDate, 'yyyy-MM-dd'),
            endDate:  this.datePipe.transform(this.forumVar.endDate, 'yyyy-MM-dd')
          },
          // createdBy: this.utilService.getUserData().userId
          // topics: this.topicsArray.map(item => item.topics),
          // divisions: this.division['divisions'],
          // departments: this.department['departments'].map(item => _.pick(item, ['divisionId', 'departmentId', 'forumMappingId']))
        };
        if (this.forumEditPage.forumId) {
          const array = this.topicsArray.map(item => {
            const obj =  {
              topics: item.topics,
              forumTopicId: item.forumTopicId
            };
            return obj;
          });
          Object.assign(postData, {topics: array,
            Divisions: this.department['departments'].map(item => _.pick(item, ['divisionId', 'departmentId', 'forumMappingId'])) });
          this.forumService.forumUpdate(this.forumEditPage.forumId, postData).subscribe(result => {
            if (result && result.isSuccess) {
                this.closeModal.hide();
                this.alertService.success(this.forumVar.updateSuccessMsg);
                this.forumService.goToList(true);
            }
          });
        } else {
          Object.assign(postData, {topics: this.topicsArray.map(item => item.topics),
            divisions: this.division['divisions'],
             departments: this.department['departments'].map(item => _.pick(item, ['divisionId', 'departmentId', 'forumMappingId']))});
          this.forumService.addForum(postData).subscribe(result => {
            if (result && result.isSuccess) {
              this.alertService.success(this.forumVar.addSuccessMsg);
              this.forumService.goToList(true);
            }
          });
      }
          this.clearForm(form);
          this.forumVar.uniqueValidate = false;
      }
    } 

    clearForm(formDir) {
      if (this.forumEditPage.forumId) { 
        this.closeModal.hide();
      }
       this.forumName = '';
       this.topicsArray = [{
        topics: '',
        forumTopicId: ''
      }];
      this.departmentList = [];
      this.division['divisionList'] = [];
      formDir.reset();
      formDir.submitted  = false;
    }

}
