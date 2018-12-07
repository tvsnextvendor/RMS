import { Injectable } from '@angular/core';
@Injectable()
export class API_URL {
    constructor() { }
    public static URLS = {
        'getModules':'5c08da9b2f00004b00637a8c',
        'getTraining': '5bffc31e3200002a00b28422',
        'getQuiz':'5c0116873500006300ad07c4',
        'getCourses':'5c012a163500006c00ad0863',
        'getDashboard':'5c00e1ae3200004a00b288cc',
        //'getUsers':'5c01283c3500005d00ad085b',
        'getUsers':'5c08dd502f0000c11f637a96',
        'doSignup':'signup'
        
    }; 
}