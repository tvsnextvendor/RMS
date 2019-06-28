import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HttpService, AlertService, ForumService, UtilService ,UserService} from '../../services';
import { ForumVar } from '../../Constants/forum.var';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from '../../Constants/api_url';
import { CommonLabels } from '../../Constants/common-labels.var';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createForum',
  templateUrl: './createForum.component.html',
  styleUrls: ['./createForum.component.css']
})

export class CreateForumComponent implements OnInit {

  forumName;
  forumEditPage;
  currentDate;
  topicsArray: Array<any> = [{
    topics: '',
    forumTopicId: ''
  }];
  topics;
  successMessage;
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'value',
    enableCheckAll: true,
    itemsShowLimit: 8,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // allowSearchFilter: true
  };
  admin = {};
  division = { 'divisionList': [] };
  department = {};
  @Input() closeModal;
  departData;
  departmentList = [];
  assignList = [];
  assignToId = [];
  adminData;
  Divisions;
  submitted = false;
  itemDeselected = false;
  topicEmptyError = false

  constructor(
    private toastr: ToastrService,
    public forumVar: ForumVar,
    private forumService: ForumService,
    public alertService: AlertService,
    private datePipe: DatePipe,
    private router: Router,
    public commonLabels: CommonLabels,
    private utilService: UtilService,
    private userService :UserService) {
    this.forumVar.url = API_URL.URLS;
    this.forumVar.forumAdmin = null;
    this.forumVar.forumName = '';

  }

  ngOnInit() {
    // this.department['departData'] = [];
    // this.department['departmentList'] =[];
    // this.admin['adminData'] =[];
    this.forumVar.forumAdmin = null;
    this.forumService.editForum.subscribe(result => {
      this.forumEditPage = result;
    });
    this.currentDate = new Date();
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
        this.forumVar.forumAdmin = null;
        this.departmentList = [];
        this.division['divisionList'] = [];
        this.forumVar.startDate = '';
        this.forumVar.endDate = '';
      }
    });

  }

  getForumData() {
    this.forumService.getForumById(this.forumEditPage.forumId).subscribe((result) => {
      const forumData = result.data.rows[0];
      this.division['divisionList'] = _.uniqBy(forumData['Divisions'].map(item => {
        if (item['Division'] && item['Division']['divisionId']) {
          const obj = {
            id: item['Division']['divisionId'],
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
          const departObj = {
            id: item['Department']['departmentId'],
            value: item['Department']['departmentName']
          };
          return _.omit(departObj, _.isUndefined);
        }
      });
      this.departmentList = selectedDepartment.filter(item => item);
      this.assignToId = forumData.assignedTo;
      this.getAdminList();
      this.forumVar.forumName = forumData.forumName;
      this.topicsArray = forumData.Topics;
      this.forumVar.forumAdmin = forumData.forumAdmin;
      this.forumVar.startDate = new Date(forumData.startDate);
      this.forumVar.endDate = new Date(forumData.endDate);
    });
  }

  getAdminList() {
    // let userData = this.utilService.getUserData();
    let departmentId = this.departmentList.map(item => { return item.id });
    // let createdBy = userData.userId;
    // this.forumService.getAdmin(createdBy).subscribe((resp) => {
      const data = { 'departmentId': departmentId, 'createdBy': this.utilService.getUserData().userId }
      this.userService.getUserByDivDept(data).subscribe(resp => {
      if(resp.data){
        this.adminData = resp.data.map(item => {
          const admin = {
            id: item.userId,
            value: item.userName
          };
          return admin;
        });
        if (this.assignToId.length && this.adminData.length) {
          this.assignList = this.adminData.filter(item=>this.assignToId.some(x=>x==item.id))
        }

      }else{
        this.adminData = [];
      }
      
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
          value: item.departmentName
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
          value: item.divisionName
        };
        return division;
      });
      if (this.division['divisionList']) {
        this.getDepartmentList();
      }
    });
  }

  addTopic(i, topic) {
    this.topicsArray.push({ topics: '' });
  }

  removeTopic(i) {
    this.topicsArray.splice(i, 1);
  }

  onItemSelect(event, type) {
    if (type === 'division') {
      this.getDepartmentList();
    }
    if(type === 'department'){
      this.getAdminList();
    }
  }

  onItemAllSelect(event, type) {
    if (type === 'division') {
      this.division.divisionList = event;
      this.getDepartmentList();
    }
    if(type === 'department'){
      this.departmentList = event;
      this.getAdminList();
    }
  }

  onItemDeselect(event, type) {
    if (type === 'division') {
      this.forumService.getDepartment({ divisionId: [event.id] }).subscribe((resp) => {
        const wholeDivision = resp.data.rows;
        if (wholeDivision) {
          this.departmentList = this.departmentList.filter(o => !wholeDivision.find(x => x.departmentId === o.id));
          this.departData = this.departData.filter(o => !wholeDivision.find(x => x.departmentId === o.id));
        } else {
          // const divisionNull = this.Divisions.filter(o => !this.division['divisionList'].find(x => x.id === o.divisionId));
        }
      });
      this.itemDeselected = true;
    }
  }

  onEmpAllDeSelect(event, type){
    if(type == "division"){
      this.departmentList = [];
      this.adminData = [];
      this.departData = [];
      this.assignList = [];
    }
    else if(type == 'department'){
      this.adminData = [];
      this.assignList = [];
    }

  }

  checkNameUniqueness(forumName) {
    for (let i = 0; i < this.forumVar.forumNameList.length; i++) {
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
    const departmentList = this.departmentList;
    let topicEmpty = false;
    this.topicEmptyError = false;
    this.topicsArray.forEach(item=>{
      if(item.topics == ''){
        topicEmpty = true;
        this.topicEmptyError = true;
      }
    })
    if (this.itemDeselected && this.forumEditPage.forumId) {
      _.forEach(this.Divisions, function (totalValue, key) {
        _.forEach(departmentList, function (deparId, departKey) {
          if (totalValue.departmentId !== deparId.id) {
            totalValue.divisionId = null;
            totalValue.departmentId = null;
          }
        });
      });
    }
    this.division['divisions'] = this.division && this.division['divisionList'] && this.division['divisionList'].map(item => item.id);
    const selectedDepartments = this.departmentList;
    // console.log(this.department['departments'], 'departmentData before filter');
    this.department['departments'] = this.department && this.department['departments'] && this.department['departments'].filter(function (obj1) {
      return selectedDepartments.some(function (obj2) {
        return obj1.departmentId === obj2.id;
      });
    });
    // console.log(this.department['departments'], 'departmentlistSelected');
    let dateCheck = this.forumVar.startDate < this.forumVar.endDate ? true : false;
    if (this.forumVar.forumName && this.forumVar.forumAdmin && this.forumVar.startDate && this.forumVar.endDate &&  !this.forumVar.uniqueValidate && this.assignList.length && !topicEmpty && dateCheck) {
      const postData = {
        forum: {
          forumName: this.forumVar.forumName,
          forumAdmin: this.forumVar.forumAdmin,
          assignedTo : this.assignList.map(item=>{return item.id}),
          startDate: this.datePipe.transform(this.forumVar.startDate, 'yyyy-MM-dd'),
          endDate: this.datePipe.transform(this.forumVar.endDate, 'yyyy-MM-dd'),
          createdBy: this.utilService.getUserData().userId
        }
      };
      if (this.forumEditPage.forumId) {
        const self = this;
        // const department = this.department['departments'];
        const newSelectedDiv = self.division['divisions'].filter(o => !self.Divisions.find(x => x.divisionId === o));
        const selectedNdPresentDivi = _.map(_.unionBy(this.Divisions, this.department['departments'], 'departmentId'));
        // console.log(selectedNdPresentDivi, 'dddddddvvvvv');
        _.forEach(selectedNdPresentDivi, function (value) {
          value['forumId'] = self.forumEditPage.forumId;
        });
        const array = this.topicsArray.map(item => {
          const obj = {
            topics: item.topics,
            forumTopicId: item.forumTopicId ? item.forumTopicId : '',
            forumId: this.forumEditPage.forumId
          };
          return obj;
        });
        Object.assign(postData, {
          topics: array.map(item => { if (!item.forumTopicId) { delete item.forumTopicId; } return item; }),
          Divisions: selectedNdPresentDivi.map(item => _.pick(item, ['divisionId', 'departmentId', 'forumMappingId', 'forumId']))
        });
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
        Object.assign(postData, {
          topics: this.topicsArray.map(item => item.topics),
          // divisions: this.division['divisions'],
          departments: this.department['departments'].map(item => _.pick(item, ['divisionId', 'departmentId']))
        });
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
    else if (this.forumVar.forumName && this.forumVar.forumAdmin && this.forumVar.startDate && this.forumVar.endDate &&  !this.forumVar.uniqueValidate && this.assignList.length && !topicEmpty && !dateCheck){
      this.alertService.error('Start date should be less than end date');
    }
    else if(topicEmpty){
      this.alertService.error('Please fill the all topic fields');
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
    // this.forumVar.forumAdmin = '';
    this.departmentList = [];
    this.division['divisionList'] = [];
    formDir.reset();
    this.forumVar.forumAdmin = null;
    this.submitted = false;
    this.forumService.editPage({});
    this.assignList = [];
  }

}
