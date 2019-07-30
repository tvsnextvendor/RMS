import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {SocketService} from '../socket.service';
import * as moment from 'moment';
import {CommonService,BreadCrumbService, UtilService} from '../../services';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notificationCount = 0;
  notificationList;
  uploadPath;
  constructor(public socketService: SocketService,public utilService: UtilService) { }

  ngOnInit() {
    let userData= this.utilService.getUserData();
    this.uploadPath = userData && userData.uploadPaths && userData.uploadPaths.uploadPath ? userData.uploadPaths.uploadPath : '';
    // this.getNotification();
  }


  getNotification(){
    let userData= this.utilService.getUserData();
    let socketObj = {
      userId: userData.userId
    };  
    Observable.interval(10000).subscribe(observer => {	
      this.socketService.getNotification(socketObj).subscribe((data) => {
          this.notificationCount = data['unReadCount'];
          this.notificationList = data['rows'];
        //  console.log(this.notificationList)
      });
    });
   }
   calculateHours(date){
    var a = moment(new Date(date));
    var b = moment(new Date());
    let day =  a.from(b, true) // "2 days ago"
    var temp = day.split(" ")//now you have 3 words in temp
    if(temp[0] == 'a' || temp[0] == 'an'){
      temp[0] = '1';
    }
    return temp[0] + temp[1].charAt(0); // return as 2d
  }
}
