import { Injectable } from '@angular/core';
@Injectable()
export class Constant {
    constructor() { }
    title = {
        dashboard: 'Dashboard',
        training: 'Training',
        quiz: 'Quiz',
        accomplishment:'Accomplishments',
        changePassword:'Change Password',
        event:'Events',
        profile:'Profile'
    };
    buttons = {
        previous: 'Previous',
        takeQuiz: 'Take Quiz',
        sendPassword: 'SEND PASSWORD',
        logOut:'Log Out',
        menu:'Menu',
        signIn:'SIGN IN',
        signUp:'SIGN UP',
        save:'SAVE'
    };
    pages = {
        loginLabels: {
            signIn: 'SIGN IN',
            signInSmall: 'Sign In',
            keepmeLoggedIn: 'Keep me logged in',
            forgetYourPassword: 'Forget Your password',
            needAnAccount: 'Need an account?',
            signUp: 'Sign Up'
        },
        signinLabels: {
            signUp: 'SIGN UP',
            signupSmall: 'Sign Up',
            fullName: 'Full Name',
            emailId: 'Email ID',
            mobileNo: 'Mobile No',
            validations: {
                usernameRequired: 'Username is required',
                usernameMinlength: 'Minimum 4 characters',
                usernameMaxlength: 'Maximum 8 characters',
                usernamePattern: 'Just use alphabet character',
                emailRequired: 'Email is required',
                emailInvalid: 'Email address invalid',
                mobileNoRequired: 'Mobile No is required'
            }
        },
        forgetPasswordLabels: {
            forgetPassword: 'FORGOT PASSWORD ?',
            mobileNumber: 'Mobile Number',
            emailId: 'Enter Email ID',
            sendPassword: 'SEND PASSWORD',
            validations: {
                emailRequired: 'Email is required',
                emailInvalid: 'Email address invalid',
                mobileNoRequired: 'Mobile No is required'
            }
        },
        dashboardLabels: {
            goodMrng: 'Good Morning',
            currentTime: 'Thursday, Aug 10',
            selectModules:'All Modules',
            modules:'Modules',
            training: 'Training',
            certification: 'Certification',
            newCourses: 'New Courses',
            courses: 'Courses',
            more: 'More',
            assignedLabel: 'Assigned',
            progressLabel: 'In Progress',
            avgCompletionRate: 'Average Completion Rate',
            you: 'You',
            peers: 'Peers',
            yourAvgOnCourses: 'Your Average Score On Courses',
            viewAll: 'View All',
            viewMore: 'View More',
            viewLess: 'View Less',
            course: 'Course',
            score: 'Score',
            average: 'Average',
            download: 'Download',
            view: 'View',
            badges: 'Badges',
            accomplishments: 'Accomplishments',
            certificatesObtained:'Certificates Obtained',
            badgesObtained:'Badges Obtained'

        },
        trainingLabels: {
            assignedLabel: 'Assigned',
            progressLabel: 'In Progress',
            completedLabel: 'Completed',
            postedLabel: 'Posted :',
            lastViewed: 'Last Viewed :'
        },
        quizResultLabels: {
            congratulations: 'Congratulations',
            yourscored: 'You scored',
            outOf: 'out of',
            exc: '!',
            yourScorePercent: 'Your Score:'
        },
        settingLabels:{
            oldPassword:'Old Password',
            newPassword:'New Password',
            confirmPassword:'Confirm Password',
            validations:{
                oldPasswordRequired: 'Old password is required',
                newPasswordRequired: 'New password is required',
                confirmPasswordRequired:'Confirm password is required',
                minLength: 'Minimum 8 characters',
                maxLength: 'Maximum 12 characters',
                pattern: 'Just use alphabet character',
            }
        },
        profileLabels:{
            email:'Email',
            mobile:'Mobile',
            department:'Department',
            designation:'Designation'
        }
    };
}