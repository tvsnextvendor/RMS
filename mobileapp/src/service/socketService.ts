
import {API} from '../constants/API.var';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

export class SocketService
{
  private url = API.API_LINK+API.SOCKET_PORT;  
  private socket;


init()
{
  this.socket = io(this.url);
}   

getNotification(userId){
  this.socket = io(this.url);	
  const subject = new Observable(subject => {
    this.socket.emit('userId', userId);
    this.socket.once("getNotifications", function(data) {
      subject.next(data);
    });
   });
   return subject;
}



}