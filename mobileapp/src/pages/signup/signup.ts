import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
//import { API_URL } from '../../constants/API_URLS.var';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GooglePlus } from '@ionic-native/google-plus';
import { LinkedIn } from '@ionic-native/linkedin';



@IonicPage({ name: 'signup-page' })
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage implements OnInit {
  signupform: FormGroup;
  signup = {
    "username": "",
    "emailAddress": "",
    "phoneNumber": ""
  }
  scopes;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpProvider, public toastrCtrl: ToastController, public googlePlus: GooglePlus, public linkedin: LinkedIn) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.signupform = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(8)]),
      phone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
    });
  }
  signupfn() {
    console.log(this.signup);


    let toast = this.toastrCtrl.create({
      message: 'Sign up successfully',
      duration: 2000,
      position: 'top',
      cssClass: 'error'
    });
    toast.present();


    //API_URL.URLS.doSignup
    // this.http.post('/signup', this.signup).subscribe((data) => {
    //   console.log(data);
    // });
  }
  loginGooglePlus() {
    this.googlePlus.login({})
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  loginLinkedIn() {
    // check if there is an active session
    // this.linkedin.hasActiveSession().then((active) => console.log('has active session?', active));

    // login
    this.scopes = ['r_basicprofile', 'r_emailaddress', 'rw_company_admin', 'w_share'];
    this.linkedin.login(this.scopes, true)
      .then(() => console.log('Logged in!'))
      .catch(e => console.log('Error logging in', e));

  }

}
