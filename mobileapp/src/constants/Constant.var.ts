import { Injectable } from '@angular/core';
@Injectable()
export class Constant {
    constructor() { }
    title = {
        dashboard: 'Dashboard',
        training: 'Training',
        quiz: 'Quiz'
    };
    buttons = {
        previous: 'Previous',
        takeQuiz: 'Take Quiz',
        sendPassword:'SEND PASSWORD'
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
            download: 'Download',
            view: 'View',
            badges: 'Badges'
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
        }
    };
}