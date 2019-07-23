
import { API } from '../Constants/api';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
  })

export class SocketService {
    private url = API.API_ENDPOINT+ API.SOCKET_PORT;
    private socket;


    init() {
        this.socket = io(this.url);
    }

    getNotification(userId) {
        this.socket = io(this.url);
        const subject = new Observable(subject => {
            this.socket.emit('userId', userId);
            this.socket.once("getNotifications", function(data) {
                subject.next(data.notifications);
            });
        });
        return subject;
    }
}