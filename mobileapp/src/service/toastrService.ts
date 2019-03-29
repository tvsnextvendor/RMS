import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
@Injectable()
export class ToastrService {
    constructor(private toastrCtrl: ToastController) {

    }
    success(message) {
        let toast = this.toastrCtrl.create({
            message: message,
            duration: 1500,
            position: 'top',
            cssClass: 'toastr-success'
        });
        toast.present();
    }
    error(message) {
        let toast = this.toastrCtrl.create({
            message: message,
            duration: 1500,
            position: 'top',
            cssClass: 'toastr-error'
        });
        toast.present();
    }
}
