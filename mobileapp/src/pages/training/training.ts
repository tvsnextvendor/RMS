import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, LoadingController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { TrainingDetailPage } from '../training-detail/training-detail';
import { Constant } from '../../constants/Constant.var';
import { API_URL } from '../../constants/API_URLS.var';

@IonicPage()
@Component({
  selector: 'page-training',
  templateUrl: 'training.html',
  providers: [Constant]
})
export class TrainingPage {
  training;
  assignedList;
  inprogressList;
  completedList;
  paramsData = {};

  showAssigned: boolean = false;
  showProgress: boolean = true;
  showCompleted: boolean = true;
  detailObject;
  statusKey;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpProvider, public constant: Constant, public apiUrl: API_URL, public loadingCtrl: LoadingController) {
    this.detailObject = this.navParams.data;
    this.statusKey = this.detailObject['status'] ? this.detailObject['status'] : 'assigned';
  }
  @ViewChild('myTabs') tabRef: Tabs;
  //first load
  ionViewDidLoad() {
    console.log('ionViewDidLoad TrainingPage');
    this.getTrainingList();
    this.showData(this.statusKey);

  }
  // show tabs
  showData(show) {
    switch (show) {
      case 'assigned':
        this.showAssigned = false;
        this.showProgress = true;
        this.showCompleted = true;
        break;
      case 'inprogress':
        this.showAssigned = true;
        this.showProgress = false;
        this.showCompleted = true;
        break;
      case 'complete':
        this.showAssigned = true;
        this.showProgress = true;
        this.showCompleted = false;
        break;
      default:
        this.showAssigned = false;
        this.showProgress = true;
        this.showCompleted = true;
    }
  }

  // get training list
  getTrainingList() {
    this.http.getData(API_URL.URLS.getTraining).subscribe((data) => {
      this.training = data;
      this.assignedList = this.training.assigned;
      this.inprogressList = this.training.inprogress;
      this.completedList = this.training.completed;
    });
  }

  //open  page
  openTrainingDetail(detailObj, selectedIndex) {
    this.paramsData['setData'] = detailObj;
    this.paramsData['selectedIndex'] = selectedIndex;
    this.navCtrl.push(TrainingDetailPage, this.paramsData);
  }





}
