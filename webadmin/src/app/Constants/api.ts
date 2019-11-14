import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class API {
    public static API_URL = 'https://www.mocky.io/v2/';

    // DEMO URL
    // public static API_ENDPOINT = 'http://demo.greatinnovus.com:'; 

    // Staging URL
     public static API_ENDPOINT = 'http://ec2-34-227-100-123.compute-1.amazonaws.com:'; 

    // Production URL 
    //public static API_ENDPOINT = 'http://ec2-18-207-186-212.compute-1.amazonaws.com:';

    // Local URL 
    //public static API_ENDPOINT = 'http://192.168.1.81:';
    public static AWS = true;
    public static SOCKET_PORT = 8181;
}

