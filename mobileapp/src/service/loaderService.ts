import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
@Injectable()
export class LoaderService {
    loading;
    constructor(private loadingCtrl: LoadingController) {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true
        });
    }
    showLoader() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true,
            duration: 5000
        });
        this.loading.present();
    }
    hideLoader() {
        if (this.loading) {
            this.loading.dismissAll();
        }
    }
}


