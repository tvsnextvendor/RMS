
import { API } from '../Constants/api';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private url = API.API_ENDPOINT + API.SOCKET_PORT;
    private socket;
   
    constructor() {
        this.socket = io(this.url, { transports: ['websocket']});
      }
    // init() {
    //     this.socket = io(this.url);
    // }
    getNotification(userId) {
          this.socket = io.connect(this.url); 
         const subject = new Observable(subject => {
             //console.log("Yesterday",userId);
           // this.socket = io(this.url, { transports: ['websocket'] });
            this.socket.emit('webUserId', userId);
            this.socket.once("getNotifications", function (data) {
                subject.next(data.notifications);                
            });
            return () => {
                this.socket.disconnect();
              };
           
        });
        return subject;
    }
    socketClose(){
        this.socket.on('notify_processdone', this.socket.close());
        this.socket.disconnect();
    }
}