import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ToastController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { Constant } from '../../constants/Constant.var';
import { Storage } from '@ionic/storage';
import { API_URL } from '../../constants/API_URLS.var';

@IonicPage({
  name: 'home-page'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Constant]
})
export class HomePage {
  dataDashboard: any = [];
  currentdate;
  paramsData = {};
  dashboardInfo: any = {};
  trainingDatas: any = {};
  modules: any = [];
  showMore:boolean = false;

  constructor(public navCtrl: NavController, private http: HttpProvider, public constant: Constant, public navParams: NavParams, public storage: Storage, public toastrCtrl: ToastController) {
    this.currentdate = this.getCurrentTime();
  }
  //first load
  ionViewDidLoad() {
    this.getDashboardInfo();
    this.getModules();
  }
  goToChildPage(status) {
    this.paramsData['status'] = status;
    this.navCtrl.setRoot('training-page', this.paramsData)
  }
  getDashboardInfo() {
    this.http.getData(API_URL.URLS.getDashboard).subscribe((data) => {
      this.storage.set('userDashboardInfo', data).then(() => {
        console.log('Data has been set');
      });
      this.dashboardInfo = data;
      this.trainingDatas = this.dashboardInfo.training;
    });
  }
  getModules() {
    this.http.getData(API_URL.URLS.getModules).subscribe((data) => {
     // let resdata = JSON.stringify(data);
      if(data['isSuccess']){
        this.modules = data['ModuleList'];
      }
      console.log(this.modules);
    });
  }
  getCurrentTime() {
    let d = new Date();
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[d.getDay()] + ',' + months[d.getMonth()] + ' ' + d.getDate();
  }
}
