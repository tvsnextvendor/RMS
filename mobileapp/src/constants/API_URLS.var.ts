import { Injectable } from '@angular/core';
@Injectable()
export class API_URL {
    constructor() { }
    public static URLS = {
        'getModules': '5c08da9b2f00004b00637a8c',
        'getTraining': '5bffc31e3200002a00b28422',
        'getQuiz': '5c0116873500006300ad07c4',
        //'getCourses': '5c012a163500006c00ad0863',
        'getCourses':'5c120d55330000d70b998ccb',
        'getDashboard': '5c0a184d3500005300a85f30',
        'getBatch':'5c0fc142310000f92f24ee83',
        //'getDashboard':'5c00e1ae3200004a00b288cc',
        //'getUsers':'5c01283c3500005d00ad085b',
        'getUsers': '5c0a7496350000d11ea86177',
        'doSignup': 'signup',
       // 'getForum':'5c15129a3400005b1cb8e9a2',
       'getForum':'5c24bb603000008e007a6118',
        'getNotification':'5c15fac72e0000f30e37c6c9',
        //'getCertificates':'5c174db82f00002a00b085d1'
        //'getCertificates':'5c175c4b2f00006e00b0861c',
        'getCertificates':'5c18f4fe2f00006500af130d',
        'getCalendars':'5c2475ea3000005b007a5fc4'
        //**** */'getCalendars':'5c1e5e063100002b00fdd27f'
        //'getCalendars':'5c1e3d093100006600fdd269'
    };
}