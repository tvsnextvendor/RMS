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
        takeQuiz:'Take Quiz'
    }
    pages = {
        dashboardLabels: {
            goodMrng: 'Good Morning',
            currentTime: 'Thursday, Aug 10',
            training:'Training',
            certification:'Certification',
            newCourses:'New Courses',
            courses:'Courses',
            more:'More',
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
            postedLabel:'Posted :',
            lastViewed:'Last Viewed :'
        },
        quizResultLabels: {
            congratulations: 'Congratulations',
            yourscored: 'You scored',
            outOf: 'out of',
            exc:'!',
            yourScorePercent: 'Your Score:'
        }
    }
}