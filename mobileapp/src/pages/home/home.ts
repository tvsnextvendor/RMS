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

  constructor(public navCtrl: NavController, private http: HttpProvider, public constant: Constant, public navParams: NavParams, public storage: Storage, public toastrCtrl: ToastController) {
    this.currentdate = new Date();
  }
  //first load
  ionViewDidLoad() {
    this.getDashboardInfo();
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
      // console.log(this.dashboardInfo);
      // debugger;
    });
  }
}
