import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  dataDashboard: any = [];
  constructor(public navCtrl: NavController, private http: HttpProvider) {

  }

  //first load
  ionViewDidLoad() {
    this.getDashboard();
  }

  //get data for dahboard

  getDashboard() {
    this.http.get('./assets/apidata/dashboard.json').subscribe((data) => {
      this.dataDashboard = data;
      console.log(this.dataDashboard);
    });
  }

}
