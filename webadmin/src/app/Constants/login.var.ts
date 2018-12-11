import {Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class loginVar {

  public email;
  public password;
  
  labels = {
    "title" : "Login",
    "forgetPasswordTitle" : "Forgot password",
    "forgetPasswordMsg" : "Please enter your email ID to reset your password",
    "emailError" : "Email is Required",
    "passwordError" : "Password is Required",
    "rememberMe" : "Keep me logged in",
    
  };
  btns = {
    "login" : "Login",
    "back" : "Back",
    "send" : "Send",
    "forgetPassword" : "Forgot Password?"
  };
}