import { Injectable } from '@angular/core';
@Injectable()
export class Constant {
    constructor() { }
    title = {
        dashboard: 'Dashboard',
        training: 'Training',
        quiz: 'Quiz',
        accomplishment: 'Accomplishments',
        changePassword: 'Change Password',
        event: 'Training Schedule',
        profile: 'Profile',
        feedback:'Feedback',
        forum: 'Forum',
        topic: 'Topic',
        menu: 'Menu',
        logOut: 'Logout',
        notification: 'Notification',
        settings: 'Settings',
        library:'Library',
        calendar:'Calendar',
        noData: 'No Data Found',
        noSchedules: 'No Training Schedule Found'
    };
    buttons = {
        previous: 'Previous',
        takeQuiz: 'Take Quiz',
        sendPassword: 'SEND PASSWORD',
        logOut: 'Log Out',
        menu: 'Menu',
        signIn: 'SIGN IN',
        signUp: 'SIGN UP',
        save: 'SAVE',
        add: 'ADD',
        cancel: 'CANCEL',
        addQuestion: 'Add Question',
        comment: 'Comment',
        next: 'Next',
        submit: 'Submit',
        uploadContent : 'Upload Content',
        launch: 'LAUNCH',
        ok : 'Ok',
        done : 'Done',
        viewContent : 'View Content',
        calendar: 'Calendar'
    };
    pages = {
        loginLabels: {
            signIn: 'SIGN IN',
            signInSmall: 'Sign In',
            keepmeLoggedIn: 'Keep me logged in',
            forgetYourPassword: 'Forgot your password',
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
                mobileNoRequired: 'Mobile No is required',
                mobileInvalid: 'Mobile  No invalid'
            }
        },
        dashboardLabels: {
            goodMrng: 'Good Morning',
            currentTime: 'Thursday, Aug 10',
            selectModules: 'All Programs',
            module: 'Program',
            modules: 'Programs',
            training: 'Training',
            certification: 'Certification',
            newCourses: 'New Courses',
            courses: 'Courses',
            more: 'More',
            assignedLabel: 'Assigned',
            progressLabel: 'In Progress',
            avgCompletionRate: 'Completed',
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
            certificatesObtained: 'Certificates Obtained',
            badgesObtained: 'Badges Obtained',
            complete: 'Complete',
            courseExpiring:'Courses Expiring',
            signatureRequired: 'Signature Required',
            generalNotifications: 'General Notifications',
            trainingClasses :'Training Classes',
            expire: 'Will expire in',
            noData:'No Expiring Training Schedules Found',
            zero: '0'

        },
        trainingLabels: {
            assignedLabel: 'Assigned',
            progressLabel: 'In Progress',
            completedLabel: 'Completed',
            signRequired: 'Sign Required',
            trainingClass:'Training Class',
            postedLabel: 'Posted :',
            lastViewed: 'Last Viewed :',
            ackText: 'I acknowledge that i have read the attached ',
            document: 'document',
            readMore: '>> Read More',
            viewContent: 'View Content',
            readLess: '<< Read Less',
            willExpire: 'Will expire in',
            launchMsg : 'This feature cannot be accessed via mobile application. Please check your email for credentials and open the application in a web browser'
        },
        libraryLabels:{

        },
        quizResultLabels: {
            congratulations: 'Congratulations',
            yourscored: 'You scored',
            outOf: 'out of',
            exc: '!',
            yourScorePercent: 'Your Score:',
            feedbackDescription: 'What did you love about this course ?',
            feedbackPlaceholder: 'Any Suggestions / Feedback',
            validations: {
                descriptionRequired: 'Description is required'
            }

        },
        feedbackLabels:{
           feedbackType: 'Select type of feedback',
           compliment:'Compliment',
           suggestion:'Query or Suggestion',
           complaint:'Complaint',
           tellUs:'Tell us more',
           submit :'Submit Feedback',
           feedback:"What's your Feedback?"
        },
        settingLabels: {
            oldPassword: 'Old Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password',
            validations: {
                oldPasswordRequired: 'Old password is required',
                newPasswordRequired: 'New password is required',
                confirmPasswordRequired: 'Confirm password is required',
                minLength: 'Minimum 6 characters',
                maxLength: 'Maximum 12 characters',
                pattern: 'Just use alphabet character',
            }
        },
        profileLabels: {
            email: 'Email',
            mobile: 'Mobile',
            department: 'Department',
            designation: 'Designation',
            validations:{
                emailRequired:'Email is required',
                invalidEmail:'Invalid Email address',
                userRequired: 'User Name is required',
                mobileRequired:'Mobile Number is required',
                invalidMobile:'Invalid Mobile Number'

            }
        },
        forumLabels: {
            topics: 'Topics',
            mostRecent: 'Most Recent',
            featuredTopics: 'Featured Topics',
            featuredFav: 'Most Favorite',
            votes: 'Votes',
            answers: 'Answers',
            hoursAgo: 'hours ago',
            replays: 'Replies',
            replies: 'replies',
            typeQuestionHere: 'Type your question here',
            validations: {
                questionRequired: 'Question is required'
            }
        },

        accomplishmentLabels: {
            certificates: 'Certificates',
            badges: 'Badges',
            gradeAchieved: 'Grade Acheived',
            completedBy: 'Completed By',
            at: 'At'

        }
    };
}