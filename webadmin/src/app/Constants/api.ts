import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class API {
    public static API_URL ='https://www.mocky.io/v2/';
    //public static API_ENDPOINT = 'http://demo.greatinnovus.com:'; 
    public static API_ENDPOINT = 'http://ec2-34-227-100-123.compute-1.amazonaws.com:'; 
    // public static API_ENDPOINT = 'http://192.168.1.21:'; 
    public static AWS = false;
    public static SOCKET_PORT = 8181;
}




