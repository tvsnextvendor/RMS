import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { Constant} from '../../constants/Constant.var';
import { TrainingPage } from '../training/training';

@IonicPage({
    name: 'home-page'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[Constant]
})
export class HomePage {
  dataDashboard: any = [];
  currentdate;
  paramsData = {};
  constructor(public navCtrl: NavController, private http: HttpProvider,public constant:Constant) {
   this.currentdate = new Date(); 
  }

  //first load
  ionViewDidLoad() {
    this.getDashboard();
  }

  //get data for dahboard
  getDashboard() {
    this.http.get('./assets/apidata/dashboard.json').subscribe((data) => {
      this.dataDashboard = data;
    });
  }
  
  goToChildPage(status){
    this.paramsData['status'] = status;
    this.navCtrl.push(TrainingPage,this.paramsData)
  }
}
