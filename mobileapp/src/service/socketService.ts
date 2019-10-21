
import { API } from '../constants/API.var';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()

export class SocketService {
  private url = API.API_LINK + API.SOCKET_PORT;
  private socket;
  userdisconnected;
  userId;


  init() {
    this.socket = io(this.url, { transports: ['websocket'] });
  }

  manualSocketDisconnect() {
    this.socket.disconnect();
    this.socket.close();
    console.log("Socket Closed.");
  }


  getNotification(userId) {
    let self = this;
    this.socket = io(this.url, { transports: ['websocket'] });
    const subject = new Observable(subject => {
      this.userId = userId;
      this.socket.emit('userId', userId);
      this.socket.once("getNotifications", function (data) {
        subject.next(data.notifications);
      });
      // this.socket.once("userdisconnected", function (data) {
      //   console.log("disconnection here")
      //   self.manualSocketDisconnect();
      // });

      // this.socket.emit('userdisconnected',userdisconnected);
      return () => {
        this.socket.disconnect();
        console.log("came here to return");
       // this.ManualSocketDisconnect();
        // this.socket.on('disconnect',reason => { 
        //   console.log(reason);
        //   if(reason === 'io server disconnect') {
        //     //you should renew token or do another important things before reconnecting
        //     this.socket.connect();
        //   }
        // });
      };
    });
    return subject;
  }



}