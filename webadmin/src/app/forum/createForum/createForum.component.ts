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
    division = {'divisionList': []};
    department = {};
    @Input() closeModal;
    departData;
    departmentList = [];
    adminData;
    Divisions;
    submitted = false;
    itemDeselected = false;

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
    this.forumVar.forumName = '';

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
    if (this.forumEditPage.forumId) {
      this.getForumData();
     }

     this.forumService.closeModel.subscribe(result => {
      if (result) {
        this.forumVar.forumName = '';
        this.topicsArray = [{
        topics: '',
        forumTopicId: ''
        }];
        this.forumVar.forumAdmin = '';
        this.departmentList = [];
        this.division['divisionList'] = [];
        this.forumVar.startDate = '';
        this.forumVar.endDate = '';
        this.forumService.editPage({});
      }
      });

   }

   getForumData() {
      this.forumService.getForumById(this.forumEditPage.forumId).subscribe((result) => {
        const forumData = result.data.rows[0];
        this.division['divisionList'] = _.uniqBy(forumData['Divisions'].map(item => {
          if (item['Division']['divisionId']) {
            const obj = {
              id: item['Division']['divisionId'] ,
              value: item['Division']['divisionName']
            };
            return obj;
          }
        }), 'id');
        if (this.division['divisionList']) {
          this.getDepartmentList();
        }
        this.Divisions = forumData['Divisions'].map(item => _.pick(item, ['divisionId', 'departmentId', 'forumMappingId']));
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
        this.division['divisionData'] = resp.data['divisions'].map(item => {
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

    onItemDeselect(event, type) {
      if (type === 'division') {
        // this.division['divisionList'].map(item => {
        //   item.id = event.id;
        // })
      //   this.forumService.getDepartment({divisionId: [event.id]}).subscribe((resp) => {
      //     const wholeDivision = resp.data.rows;
      //     console.log(wholeDivision);
      //     if(wholeDivision) {
      //       this.departmentList = this.departmentList.filter(o => !wholeDivision.find(x => x.departmentId === o.id));
      //       this.Divisions = this.Divisions.filter(o => !this.departmentList.find(x => x.id === o.departmentId));
      //     } else {
      //       this.Divisions = this.Divisions.filter(o => !this.division['divisionList'].find(x => x.id === o.divisionId));
      //     }
      //   });
      // this.itemDeselected = true;
      
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
      this.submitted = true;
      this.division['divisions'] = this.division && this.division['divisionList'] && this.division['divisionList'].map(item => item.id);

      const selectedDepartments = this.departmentList;
      console.log(this.department['departments'], 'departmentData before filter');
      this.department['departments'] = this.department && this.department['departments'] && this.department['departments'].filter(function(obj1) {
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
        console.log(this.Divisions, 'departmentData');
        if (this.forumEditPage.forumId) {
          const self = this;
          // const department = this.department['departments'];
          const newSelectedDiv = self.division['divisions'].filter(o => !self.Divisions.find(x => x.divisionId === o));
          const selectedNdPresentDivi = _.map(_.unionBy(this.Divisions, this.department['departments'], 'departmentId'));
          _.forEach(selectedNdPresentDivi, function(value) {
            value['forumId'] = self.forumEditPage.forumId;
          });
          const array = this.topicsArray.map(item => {
            const obj =  {
              topics: item.topics,
              forumTopicId: item.forumTopicId ? item.forumTopicId : '',
              forumId: this.forumEditPage.forumId
            };
              return obj;
            });
          Object.assign(postData, {topics: array.map(item => {if (!item.forumTopicId) { delete item.forumTopicId; } return item; }),
            divisions: newSelectedDiv,
            Divisions: selectedNdPresentDivi.map(item => _.pick(item, ['divisionId', 'departmentId', 'forumMappingId', 'forumId']) )});
          this.forumService.forumUpdate(this.forumEditPage.forumId, postData).subscribe(result => {
            if (result && result.isSuccess) {
                this.closeModal.hide();
                this.submitted = false;
                this.clearForm(form);
                this.alertService.success(this.forumVar.updateSuccessMsg);
                this.forumService.goToList(true);
                this.forumService.editPage({});
            }
          }, err => {
            if (this.commonLabels.mandatoryLabels[err.error.error]) {
              this.alertService.error(this.commonLabels.mandatoryLabels[err.error.error]);
            } else {
              this.alertService.error(err.error.error);
            }
            return false;
        });
        } else {
          Object.assign(postData, {topics: this.topicsArray.map(item => item.topics),
            divisions: this.division['divisions'],
             departments: this.department['departments'].map(item => _.pick(item, ['divisionId', 'departmentId']))});
          this.forumService.addForum(postData).subscribe(result => {
            if (result && result.isSuccess) {
              this.submitted = false;
              this.clearForm(form);
              this.alertService.success(this.forumVar.addSuccessMsg);
              this.forumService.goToList(true);
            }
          }, err => {
            if (this.commonLabels.mandatoryLabels[err.error.error]) {
              this.alertService.error(this.commonLabels.mandatoryLabels[err.error.error]);
            } else {
              this.alertService.error(err.error.error);
            }
            return;
        });
      }
          // this.clearForm(form);
          // this.forumVar.uniqueValidate = false;
      }
    }

    clearForm(formDir) {
      if (this.forumEditPage.forumId && this.closeModal) {
        this.closeModal.hide();
      }
       this.forumName = '';
       this.topicsArray = [{
        topics: '',
        forumTopicId: ''
      }];
      this.forumVar.forumAdmin = '';
      this.departmentList = [];
      this.division['divisionList'] = [];
      formDir.reset();
      this.forumVar.forumAdmin = '';
      this.submitted  = false;
      this.forumService.editPage({});
    }

}
