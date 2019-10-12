
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
        const subject = new Observable(subject => {
            this.socket = io(this.url, { transports: ['websocket'] });
            this.socket.emit('userId', userId);
            this.socket.once("getNotifications", function (data) {
                subject.next(data.notifications);
            });
            // return () => {
            //    // this.socket.on('notify_processdone', this.socket.close());
            //    // this.socket.disconnect();
            // };
        });
        return subject;
    }
    socketClose(){
        this.socket.on('notify_processdone', this.socket.close());
        this.socket.disconnect();
    }
}