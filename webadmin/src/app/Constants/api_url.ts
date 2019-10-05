import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class API_URL {

  public static URLS = {
    //Forum//
    getForumList: '5c32e1e22e00006b00121d6a',
    //*getForumList : '5c17879a2f00008200b087a8',
    getAdminList: '5c2e12912f00005d0017542a',


    //Program//
    ProgramModuleList: '5c416f6c0f0000233ee7b7b8',
    //ProgramModuleList : '5c36f14c3000005b001f60e1',

    //Certificate Templates//
    getTemplateList: '5c34b04e2e0000490037902a',
    getBadgePercentage: '5cf6006832000015298ccf59',
    getCoursesList: "5c34596a2e00007d00378d8d",


    //Training Batch//
    getNewBatchList: '5c34ae832e00004a0037901f',
    getProgramList: '5c2de3ee2f00001c3d1752bb',
    getPercentageList: '5c25f8a7300000520067f64c',
    //getNewBatchList : '5c2e16a32f0000a052175443',

    //User//
    getDepartments: '5c25fa2a300000540067f651',
    getDesignations: '5c29c1d22e00006a00c18ac7',
    getDivision: '5ca1ad2a3700005c00899357',

    //Programs//
    getModuleCourseList: "5c35ccbf300000670021b539",
    getCoureseDetails: "5c2e11db2f00003847175427",

    //resort//
    getResortListPageData : "5ca456ba4b00003d422099f2",

    //Dashboard//
    getKeyStat: "5c04dd7f330000e900d01e32",
    getCourses: "5c2dbf2e2f000056301751f7",
    getEmployeeProgress: '5c3458c92e00009000378d89',
    getCertificationTrend: '5c32f85c2e00007400121dcd',
    
    //getTopEmployees      : "5c04e6cf3300002900d01e56",
    getTopEmployees: "5c2e14522f0000ba47175436",
    getvisitorsByResorts: "5c2df1f32f0000384717533d",
    getTotalNoOfBadges: "5c3716a23000006f001f61b1",
    getTopResorts: "5c2df06d2f00005a00175329",
    getTopCourses: "5c25bdcc300000620067f58b",
    getBadgesAndCertification: '5c373a0830000086001f6309',
    getReservationByResort: '5c2df39d2f0000b73617534f',
    getQuiz: '5c0f73143100002c0924ec31',
    getFeedbackRating: '5c28ddc73300007400a58bb5',
    getVideoTrendList: '5c1b552b33000066007fd6db',
    getVideoTrendEmpList: '5c2e12ca2f00005d0017542c',
    //*Needed-getModuleList        : '5c18f3502f00002a00af12f9',
    //*getModuleDetails     : "5c1a2a833200006c0064afa0",
    getModuleDetails: '5c35c79d300000790021b503',
    getEmployeeStatus: '5c2debd22f0000ba47175307',
    // getEmployeeDetails: '5c3330f72e00002b00121f06',
    getTaskResortChart: '5c3847ee3100003600a98f24',
    getCourseTrendChart: '5c2dbe012f000017331751f2',
    getYearList: '5c1355633400007500ecdf6f',
    //*needed - moduleCourseList     : '5c24973f30000077007a6042',
    // getEmployeeList: '5c0928d52f0000c21f637cd0',
    getUsers: '5c35ea0a300000600021b667',
    getUsersList: '5ca1b9af370000640089938c',
    //*getUsersList      : '5c260d313000007f0067f6ba', 
    // Content To Bo Live
    getModuleList: '5c28b1fd3300005900a58b80',
    //moduleCourseList:'5c28aec43300004e00a58b7d'
    getResortList: '5c2df79b2f0000a230175376',
    //*** */ moduleCourseList: '5c2deec42f00003747175314',
    // moduleCourseList: '5c332c832e00006b00121ee1',
    //moduleCourseList :'5c359ca23000008e0021b3d2',
    moduleCourseList: '5c35f1bd3000008f0021b692',
    getNotifications: '5c2f13d23200001000590603',
    getVisitorsStaffData: '5c2ef7383200007200590561',
    getListPageCourse : '5ca1ad583700005600899358',

   
    //Common Services
    divisionList: '8102/division/List',
    departmentList: '8102/department/List',
    resortDivisionList : '8102/resort/getResortDetails?resortId=',
    roleList:'8103/role/List',
    resortList:'8102/resort/List',
    designationList:'8102/designation/List',
    uploadFiles:'8103/uploadFiles',
    removeFiles:'8103/remove',
    updateFiles:'8103/fileUpdate',
   
    //Course Services
    courseAdd: '8103/course/Add',
    courseList:'8103/course/List',
    courseUpdate:'8103/course/Update/',
    courseDelete:'8103/course/Delete/',
    scheduleTraining: '8103/scheduleTraining',
    trainingClassAdd:'8103/trainingClass/Add',
    trainingClassCourse:'8103/trainingClass/List',
    trainingClass:'8103/trainingClass/trainingList',
    trainingClassQuiz:'8103/trainingClass/QuizList',
    getCreatedByDetails:'8103/course/getCreatedByDetails',
    fileList:'8103/trainingClass/fileList',
    fileDelete:'8103/trainingClass/fileDelete/',
    getResortDivision:'8103/resort/getresortDivision',
    trainingClassUpdate: '8103/trainingClass/trainingClassUpdateByName/',
    courseTrainingClassUpdate:'8103/trainingClass/Update/',
    courseEditFileList : '8103/course/getEditdetails',
    courseListUpdate : '8103/course/courseUpdate/',
    quizAdd:'8103/trainingClass/quizAdd',
    quizListUpdate : '8103/trainingClass/quizUpdate/',
    quizUpdate : "8103/quizUpdate/",
    questionUpdate:'8103/trainingClass/questionUpdate/',
    quizDelete : '8103/trainingClass/quizDelete/',
    getTrainingClassById : '8103/course/getTrainingClasses',
    assignVideoToCourse: '8103/course/assignVideosToCourse',
    addDuplicateCourse : '8103/course/courseDuplicate',
    getCourseTrainingClassById : '8103/trainingClass/TrainingFileList',
    getFilesByTCId:'8103/trainingClass/classFilesList',
    getEmployeeList : '8103/courseEmployeestatusList',
    getEmployeeDetails : '8103/employeeFilestatusList',
    getScheduleTraining : '8103/schedule',
    getPopupScheduleData : '8103/schedule/getDetailsById',
    updateScheduleTraining : '8103/updateScheduleTraining/',
    setPermissions : '8103/trainingClass/filePermissionAdd',
    getCourseById : '8103/course/getIndividualCourses',
    saveAsNewVersion : '8103/course/saveAsNewVersion',
    getTrainingClassList : '8103/trainingclass/getTrainingClassList',
    dropdownTCList:'8103/trainingclass/trainingClasses',
    sendApproval:'8103/createApproval',
    getCourseByResort:'8103/course/getCourses',
  
    

    //Resort Services
    resortAdd : '8102/resort/Add',
    resortUpdate: '8102/resort/Update/',
    resortDelete: '8102/resort/Delete/',

    //Role Permission Services
    permissionAdd: '8101/permission/Add',
    permissionList: '8101/permission/List',
    getRolePermissions:'8101/permission/getRolePermissions',
    permissionUserList : '8103/trainingClass/filePermissionList',

    //Subscription Services
    subscriptionAdd: '8103/subscription/Add',

    //User Services
    userAdd: '8101/user/Add',
    userList:'8101/user/List',
    getUserByDivDept: '8103/user/getEmployeeDetails',
    userUpdate: '8101/user/Update/',
    userDelete: '8101/user/Delete/',
    addDivision : '8102/division/Add',
    deleteDivision : '8102/division/Delete/',
    divisionUpdate : '8102/division/userHierarchyUpdate/',
    addDesignation : '8102/designation/Add',
    updateDesignation : '8102/designation/Update/',
    deleteDesignation : '8102/designation/Delete/',
    checkDivision : "8102/division/checkDivision",
    checkDept : "8102/department/checkDepartment",
    checkRole : "8102/designation/checkDesignation",
    bulkUploadUrl : '8101/bulkCreate',
    userSettings : '8101/user/settings',

    //Forum Services
    forum: '8104/forum',
    departmentListWithResort: '8102/department/List?resortId=',
    forumPost: '8104/post',

    //certificate
    getCertificate : '8104/getCertificate',
    certificate: '8104/certificate/',
    addCertificate: '8104/addCertificate',
    assignCertificate : '8104/courseCertificateAssign',
    getAssignCertificate : '8104/courseAssign',
    deleteCertificate :'8104/deleteCertificate',

    //Badges
    badge : '8104/badge',

    getAllResort : "8102/resort/getAllResorts",

    //remove post
    removePost : "8104/post/",
    removeComment : "8104/comment/",


    // Feedback
    feedbackList : '8103/feedbackList',

    // notification
    addTypeOneNotification : '8103/createNotification',
    addTypeTwoNotification : '8103/signatureNotification',
    getNotification         : '8103/getNotification',
    getNotificationFile     : '8103/getNotificationFile',
    updateNotification      : '8103/updateNotification/',

    //ApprovalSettings 

    listApproval:'8103/approvallist',
    statusApproval:'8103/statusApproval/',

    certificateTrendCount:'8103/getEmployeeCoursesCount',
    certificateTrendCountDetail:'8103/getEmployeesBadgesReport',

    // Dashboard
    totalCount : '8103/getTotalCount',
    totalCourse : '8103/getTotalCourse',
    ratedTrainingClasses : '8103/topRatedTrainingClasses',
    getCourseTrend : '8103/getCourseByMonth',
    getCertificateTrend:'8103/getEmployeeCertificationTrend',
    getCertificateTrendList:'8103/getEmployeeCertificationTrendDetails',
    getCourseTrendList : '8103/getAllCoursesByMonth',
    getCourseEmployeeList : '8103/courseEmployeestatusList',
    topFiveResort : '8103/getTopFiveResorts',
    badgesData: '8103/getBadges',
    archievedSettings : '8103/archieved',
    removeSchedule : '8103/schedule/deleteSchedule/',
    expireTrend     : '8103/employeesExpireList',   
    getTrainingClassByYear : '8103/getAllTCByMonth',
    getAllNotificationsByMonth : '8103/getAllNotificationsByMonth',
    getReportingManager   : '8103/user/getReportingManagers',
    sendExpireNotification    : '8103/user/sendExpireNotification',
    sendEmail       : "8103/user/sendReportEmail",
    videoTrans : "8103/uploadDocuments",
    removeTrans  : '8103/removeDocuments',
    getAllCourseDetails : '8103/course/getSpecificCourseDatas/',
    reSchedule  : "8103/schedule/expireReschedule/",
    courseCheck : '8103/user/checkCourse',
     // addArchieve : '8103/archieved',
    // updateArchieve : '8103/archieved/',

    //password update
    forgetPassword : '8101/forgetPassword',
    resetPassword  : '8101/resetpassword'
  }
  

}


