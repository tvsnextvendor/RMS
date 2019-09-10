import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import {SocketService} from '../../service'

/**
 * Generated class for the BellComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'app-bell',
  templateUrl: 'bell.html'
})
export class BellComponent {

  currentUser;
  notificationCount;
  interval;

  constructor(public socketService: SocketService, public storage: Storage, public navCtrl:NavController) {
  }

   
  ngOnInit(){
    let self = this;
    this.storage.get('currentUser').then((user: any) => {
        if (user.token) {
            self.currentUser = user;
            this.getNotification();
            this.interval = setInterval(() => {
            this.getNotification();
            },10000)
        }
    });
  }

 
  getNotification(){
    let userId = this.currentUser.userId;
    let socketObj = {
      userId : userId,
      domain : 'mobile'
    };
   this.socketService.getNotification(socketObj).subscribe((data)=>{
       this.notificationCount = data['unReadCount'];
   });
  }


  goToNotification() {
    this.navCtrl.push('notification-page');
  }
  

  ngOnDestroy(){
    if (this.interval) {
        clearInterval(this.interval);
    }
  }


}
