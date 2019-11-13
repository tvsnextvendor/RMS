
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
    getInitialNotification(userId){
        this.socket = io.connect(this.url, { transports: ['websocket']});
        const subject = new Observable(subject => {
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
    getNotification(userId) {
         const subject = new Observable(subject => {
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