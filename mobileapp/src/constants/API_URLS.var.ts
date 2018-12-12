import { Injectable } from '@angular/core';
@Injectable()
export class API_URL {
    constructor() { }
    public static URLS = {
        'getModules': '5c08da9b2f00004b00637a8c',
        'getTraining': '5bffc31e3200002a00b28422',
        'getQuiz': '5c0116873500006300ad07c4',
        'getCourses': '5c012a163500006c00ad0863',
        'getDashboard': '5c0a184d3500005300a85f30',
        'getBatch':'5c0fc142310000f92f24ee83',
        //'getDashboard':'5c00e1ae3200004a00b288cc',
        //'getUsers':'5c01283c3500005d00ad085b',
        'getUsers': '5c0a7496350000d11ea86177',
        'doSignup': 'signup'
    };
}