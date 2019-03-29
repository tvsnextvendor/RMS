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
    "login" : "Log in",
    "back" : "Back",
    "send" : "Send",
    "submit":"Submit",
    "forgetPassword" : "Forgot Password?"
  };
}