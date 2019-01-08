import { Injectable } from '@angular/core';
@Injectable()
export class API_URL {
    constructor() { }
    public static URLS = {
        // Need 'getModules': '5c08da9b2f00004b00637a8c',
        'getTraining': '5bffc31e3200002a00b28422',
        //needed 'getQuiz': '5c0116873500006300ad07c4',
        // 'getCourses': '5c120d55330000d70b998ccb',
        // 'getDashboard': '5c0a184d3500005300a85f30',
        'getDashboard': '5c30a0713000007000e77a7a',
        'getBatch': '5c3448b82e00005900378d0c',
        'getUsers': '5c32f6832e00006900121dbf',
        'doSignup': 'signup',
        //'getForum': '5c2de1e62f000085351752a0',
        'getForum': '5c31fa44350000d203ca9fd8',
        'getNotification': '5c2dddc32f0000a23017528f',
        'getCertificates': '5c345c712e00004b00378da5',
        'getCalendars': '5c2475ea3000005b007a5fc4',
        /////'getComments': '5c31f64e3500000609ca9fcf',
        'getComments': '5c333c8d2e0000f508121f58',
        //**** */'getCalendars':'5c1e5e063100002b00fdd27f'
        //'getCalendars':'5c1e3d093100006600fdd269'
        // Content To Bo Live Mock Content 
        //'getModules': '5c28a6de3300006300a58b77',
        'getModules': '5c2de3ee2f00001c3d1752bb',
        ////////'getCourses': '5c2f54463200007200590798',
        'getCourses': '5c34a70a2e00005000378ff9',
        'getQuiz': '5c2e1c4f2f0000fd54175475'
        // 'getCourses':'5c28b3923300004e00a58b88'
    };
}