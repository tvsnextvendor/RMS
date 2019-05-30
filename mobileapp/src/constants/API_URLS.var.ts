import { Injectable } from '@angular/core';
@Injectable()
export class API_URL {
    constructor() { }
    public static URLS = {
        // Need 'getModules': '5c08da9b2f00004b00637a8c',
        'getTraining': '5bffc31e3200002a00b28422',
        'getCourse': '5cadc7542f000061283a97db',
        //needed 'getQuiz': '5c0116873500006300ad07c4',
        'getDashboard':'5c3edb0e3500002d003e99f8',
        'getBatch': '5c3878a03100005000a99043',
        'getUsers': '5c35fdb43000005b0021b70b',
        'doSignup': 'signup',
        //'getForum': '5c2de1e62f000085351752a0',
        //*needed// 'getForum': '5c31fa44350000d203ca9fd8',
        'getNotification': '5c2dddc32f0000a23017528f',
        'getCertificates': '5c40410e3500006f2eec3bf7',
        'getCalendars': '5c2475ea3000005b007a5fc4',
        /////'getComments': '5c31f64e3500000609ca9fcf',
        'getComments': '5c372a5a30000059001f628e',
        //**** */'getCalendars':'5c1e5e063100002b00fdd27f'
        //'getCalendars':'5c1e3d093100006600fdd269'
        // Content To Bo Live Mock Content 
        //'getModules': '5c28a6de3300006300a58b77',
       //----------------    'getModules': '5c2de3ee2f00001c3d1752bb',
        'getModules':'5c3842663100007800a98f0d',
        //'getCourses':'5c40a2050f0000d318e7b5d1', *needed
        'getCourses': '5caebe043400009620ab6dc7',
        'getQuiz': '5c2e1c4f2f0000fd54175475',
        // 'getCourses':'5c28b3923300004e00a58b88'

      
       'loginAPI':'8101/login',
       'trainingCourseAPI':'8103/course/courseByStatus',
       'fileTrainingStatus': '8103/updateFileTrainingStatus',
       'updateTrainingStatus':'8103/updateUserTrainingStatus',
       'getProfile' : '8101/user/List',
       'updateProfile': '8101/user/Update/',
       'trainingCourseFilesAPI':'8103/trainingClass/TrainingFileList',
       'quizAPI':'8103/trainingClass/QuizList',
       'readNotification':'8103/user/readNotification',
       'updateSettings' : '8101/user/settings',
       'completeTrainingClass':'8103/updateTrainingClassCompletedStatus',
       'postFeedBack':'8103/courseFeedback',
       'getAllSchedule': '8103/schedule/getAllSchedules',
       'getForum' : '8104/forum',
       'post' : '8104/post',
       'comment': '8104/comment',
       'appFeedback' : '8103/applicationFeedback',
       'dashboardSchedules':'8103/getScheduleExpireList',
       'dashboardCount':'8103/getDashboardCount',
       'certificates' : '8104/getUserCertificates'
       
    };
}