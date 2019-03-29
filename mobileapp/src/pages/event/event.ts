import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import {LoaderService} from '../../service/loaderService';
@IonicPage({
  name: 'event-page'
})
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage implements OnInit {
 tag: boolean = false;
  batches: any = [];
  batchconfigList:any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant, public http: HttpProvider, public API_URL: API_URL,public loader:LoaderService) {
  }
  ngOnInit(){
    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }
  ionViewDidEnter(){
    this.getBatch();
  }
  openSubEvent(batches,i) {
    batches[i].tag = !(batches[i].tag);
  }
  getBatch() {
    this.loader.showLoader();
    this.http.getData(API_URL.URLS.getBatch).subscribe((data) => {
      if (data['isSuccess']) {
        this.batches = data['BatchList'];
      }
      var self = this;
      this.batches.map(function(val,key){
        val = Object.assign({}, val);
        val.tag = false;

        
        if(val.Score && val.Score <= 50){
          val.expireTwoDays = false;
          val.activeCompleteStatus = false;
          val.retakeCourse = true;
        }
        else  if(val.CourseStatus === 'Completed'){
          val.activeCompleteStatus = true;
          val.retakeCourse = false;
          val.expireTwoDays = false;
        }
        else{
          val.expireTwoDays = true;
          val.retakeCourse = false;
          val.activeCompleteStatus = false;
        }
        self.batchconfigList.push(val);

      });
      this.loader.hideLoader();
    });
  }

}
