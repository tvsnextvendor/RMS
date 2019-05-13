import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class SettingVar {

    settingFormLabels = {
        oldPassword: 'Old Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        uploadVideos: 'Upload Videos',
        active: 'Active'
    };
    btns = {
        update: 'UPDATE',
        cancel: 'CANCEL'
    };
    mandatoryLabels = {
        minlength: 'Minimum length is 8',
        maxlength: 'Maximum length is 12',
        oldPasswordReq: 'Old password is required',
        newPasswordReq: 'New password is required',
        confirmPasswordReq: 'Confirm Password is required'
    };
    title= 'Settings';
    pwdUpdateSuccessMsg = 'Password updated successfully';
    pwdMissmatchMsg  = 'Password Mismatch';
    oldPwdRequired = 'Old Password is Mandatory';
    userId;
    settings: any = {
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
    };
}