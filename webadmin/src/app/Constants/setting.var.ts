import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class SettingVar {
    settingFormLabels = {
        oldPassword: 'Old Password',
        newPassword: 'New Password',
        confirmPassword: 'ConfirmPassword',
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
}