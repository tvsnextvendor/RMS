import { Injectable } from '@angular/core';
@Injectable()
export class API_URL {
    constructor() { }
    public static URLS = {
        // Need 'getModules': '5c08da9b2f00004b00637a8c',
        'getTraining': '5bffc31e3200002a00b28422',
        'getQuiz': '5c0116873500006300ad07c4',
        'getCourses': '5c120d55330000d70b998ccb',
        'getDashboard': '5c0a184d3500005300a85f30',
        'getBatch': '5c26217a300000820067f6ff',
        'getUsers': '5c0a7496350000d11ea86177',
        'doSignup': 'signup',
        'getForum': '5c24bb603000008e007a6118',
        'getNotification': '5c15fac72e0000f30e37c6c9',
        'getCertificates': '5c2610193000005f0067f6c5',
        'getCalendars': '5c2475ea3000005b007a5fc4',
        //**** */'getCalendars':'5c1e5e063100002b00fdd27f'
        //'getCalendars':'5c1e3d093100006600fdd269'


        // Content To Bo Live Mock Content 

        'getModules': '5c28a6de3300006300a58b77',
        // 'getCourses':'5c28b3923300004e00a58b88'
    };
}