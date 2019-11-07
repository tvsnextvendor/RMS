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
  notificationList:any=[];
  uploadPath;
  currentUser;
  constructor(public socketService: SocketService,public commonService : CommonService,public utilService: UtilService) { }

  ngOnInit() {
   this.currentUser = this.utilService.getUserData();
    this.uploadPath = this.currentUser && this.currentUser.uploadPaths && this.currentUser.uploadPaths.uploadPath ? this.currentUser.uploadPaths.uploadPath : '';
     this.getNotification();
  }


  getNotification(){  
   // console.log("NO COMPONENT")
    
    let userData = atob(localStorage.getItem('userData'));
    let parsedData:any=JSON.parse(userData);
    if(parsedData.userId){
    Observable.interval(20000).subscribe(observer => {	
     let UID:any= window.localStorage.getItem("currUserId");
      //console.log("UID",UID);
      //console.log("parsedData.userId",parsedData.userId)
      let socketObj = {
        webUserId: UID
      }; 
      //console.log("CURR  USER",this.currentUser.userId);
      //console.log("SOC",socketObj);
      this.socketService.getNotification(socketObj).subscribe((data) => {
          this.notificationCount = data['unReadCount'];
          this.notificationList = data['rows'];
      });
    });
    }
   }

    
  readAllNotification(){
     this.commonService.readAllNotification().subscribe((data)=>{
      if(data.isSuccess){
        this.notificationList = [];
      }
     })
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
