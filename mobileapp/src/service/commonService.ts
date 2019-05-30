import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable()
export class CommonService {

currentUser;

constructor( private storage: Storage) {
}

    getUser(){
            this.storage.get('currentUser').then((user: any) => {
            if (user) {
               this.currentUser = user;
            }
        });     
    }

//    async presentAlert() {
//     const alert = await this.alertController.create({
//       header: 'Alert',
//       subHeader: 'Subtitle',
//       message: 'This is an alert message.',
//       buttons: ['OK']
//     });

//     await alert.present();
//   }
   
}


