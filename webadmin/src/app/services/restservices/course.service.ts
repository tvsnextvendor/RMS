import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import {UtilService} from '../util.service';
import { map } from 'rxjs/operators';
import { API_URL } from '../../Constants/api_url';

@Injectable({    
    providedIn: 'root'
})
export class CourseService {
  
  url;

  constructor (private http: HttpService,private utilService : UtilService) {
     this.url = API_URL.URLS;
  }


  addCourse(userData){
    return this.http.post('local',this.url.courseAdd, userData);
  }

  getCourse(currentPage,size,query){
    return this.http.getLocal('local',this.url.courseList+'?page='+currentPage+'&size='+size+query);
  }

  getNotificationCourse(query){
    return this.http.getLocal('local',this.url.courseList+query);
  }

  getAllCourse(query){
    
    return this.http.getLocal('local',this.url.courseList+query);
  }

  getBatchCourse(){
    let userData = this.utilService.getUserData();
    let userId = userData.userId;
    let resortId =userData.ResortUserMappings ? userData.ResortUserMappings[0].Resort.resortId:'';
    return this.http.getLocal('local',this.url.courseList+'?resortId='+resortId+'&status=none');
  }

  getCourseById(courseId){
    return this.http.getLocal('local',this.url.courseList+'?courseId='+courseId)
  }

  getTrainingclassesById(courseId){
    return this.http.getLocal('local',this.url.getTrainingClassById+'?courseId='+courseId)
  }
  getCourseTrainingClassById(classId,courseId){
    return this.http.getLocal('local',this.url.getCourseTrainingClassById+'?trainingClassId='+classId)
  }
  getFilesByTCId(classId){
    return this.http.getLocal('local',this.url.getFilesByTCId+'?trainingClassId='+classId)
  }

  updateCourse(courseId, userData){
      return this.http.put('local',this.url.courseUpdate+courseId,userData)
  }
  updateTrainingClassName(trainingClassId, trainingClassName) {
    return this.http.put('local', this.url.trainingClassUpdate + trainingClassId, trainingClassName)
  }
  updateTrainingClass(trainingClassId,params) {
    return this.http.put('local', this.url.courseTrainingClassUpdate + trainingClassId,params)
  }
  deleteCourse(courseId,undo){
    let unDo = undo ? undo : '';
    return this.http.delete('local',this.url.courseDelete+courseId+unDo)
  }

  deleteDocument(docId){
    return this.http.delete('local',this.url.fileDelete+docId)
  }

  addTrainingClass(userData){
    return this.http.post('local',this.url.trainingClassAdd,userData);
  }

  getCourseTrainingClass(currentPage,size,query){
    return this.http.getLocal('local',this.url.trainingClassCourse+'?page='+currentPage+'&size='+size+query);
    // return this.http.getLocal('local',this.url.trainingClassCourse);
  }

  getTrainingClass(){
    return this.http.getLocal('local',this.url.trainingClass);
  }

  getTrainingClassById(trainingClassId){
    return this.http.getLocal('local',this.url.trainingClass+'?trainingClassId='+trainingClassId)
  }

  getTrainingClassQuiz(trainingClassId,courseId){
    if(courseId === ''){
      return this.http.getLocal('local',this.url.trainingClassQuiz+'?trainingClassId='+trainingClassId)
    }
    else{
      return this.http.getLocal('local',this.url.trainingClassQuiz+'?trainingClassId='+trainingClassId+'&courseId='+courseId)
    }
  }

  getQuizList(query){
     return this.http.getLocal('local',this.url.trainingClassQuiz+query)
  }

  getQuizListById(userId,query){
    return this.http.getLocal('local',this.url.trainingClassQuiz+'?createdBy='+userId+query)
 }

  scheduleTraining(data){
    return this.http.post('local',this.url.scheduleTraining, data)
  }

  getDivision(resortId,resortType){
      let resort = resortType === "parent" ? 'parentResort='+resortId : 'childResort='+resortId
      return this.http.getLocal('local',this.url.getResortDivision+'?'+resort+'&type=division');
  }

  getChildResort(resortId){
    return this.http.getLocal('local',this.url.getResortDivision+'?childResort='+resortId);
  }

  getDepartment(divisionId){
    return this.http.post('local',this.url.departmentList,{'divisionId':divisionId});
  }

  getCreatedByDetails(resortId){
    return this.http.getLocal('local',this.url.getCreatedByDetails+'?resortId='+resortId);
  }

  getFiles(params){
    let userData = this.utilService.getUserData();
    let userId = userData.userId;
    if(params.classId){
      return this.http.getLocal('local',this.url.fileList+'?fileType='+params.type+'&userId='+userId+'&trainingClassId='+params.classId+'&page='+params.page+'&size='+params.size+params.query);
    }else if(params.courseId){
      return this.http.getLocal('local',this.url.fileList+'?courseId='+params.courseId+'&userId='+userId);
    }else{
      return this.http.getLocal('local',this.url.fileList+'?fileType='+params.type+'&page='+params.page+'&size='+params.size+params.query);
    }
    
  }

  assignVideosToCourse(data){
    return this.http.post('local',this.url.assignVideoToCourse,data);
  }

  getEditCourseDetails(fileType,courseId,classId){
    return this.http.getLocal('local',this.url.courseEditFileList+'?fileType='+fileType+'&courseId='+courseId+'&trainingClassId='+classId);
  }

  updateCourseList(courseId,params){
    return this.http.put('local',this.url.courseListUpdate+courseId,params)
  }
    
  addQuiz(data){
    return this.http.post('local',this.url.quizAdd,data);
  }

  updateQuizList(quizId,params){
    return this.http.put('local',this.url.quizListUpdate+quizId,params)
  }
  updateQuizById(quizId,params){
    // quizUpdate
    return this.http.put('local',this.url.quizUpdate+quizId,params)
  }
  updateQuestion(questionId,params){
    return this.http.put('local',this.url.questionUpdate+questionId,params)
  }
  deleteQuizList(queId){
    return this.http.delete('local',this.url.quizDelete+queId)
  }
  searchQuery(CMSFilterSearchEventSet){
    let query = '';
    if(CMSFilterSearchEventSet !== undefined && CMSFilterSearchEventSet !== '')
    {
      let status             = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.status)?CMSFilterSearchEventSet.status:'';
      let courseStatus       = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.courseStatus)?CMSFilterSearchEventSet.courseStatus:'';
      let courseId           = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.courseId)?CMSFilterSearchEventSet.courseId:'';
      let trainingClassId    = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.trainingClassId)?CMSFilterSearchEventSet.trainingClassId:'';
      let divisionId         = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.parentDivisionId)?CMSFilterSearchEventSet.parentDivisionId:((CMSFilterSearchEventSet && CMSFilterSearchEventSet.childDivisionId)?CMSFilterSearchEventSet.childDivisionId:'');
      let departmentId       = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.parentDepartmentId)?CMSFilterSearchEventSet.parentDepartmentId:((CMSFilterSearchEventSet && CMSFilterSearchEventSet.childDepartmentId)?CMSFilterSearchEventSet.childDepartmentId:'');
      let subResortId        = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.childResortId)?CMSFilterSearchEventSet.childResortId:'';
      let createdBy          = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.createdBy)?CMSFilterSearchEventSet.createdBy:'';
      let search             = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.search)?CMSFilterSearchEventSet.search:''

      courseId=  (!courseId || courseId == 'null')?'':'&courseId='+courseId;
      trainingClassId = (!trainingClassId || trainingClassId == 'null')?'':'&trainingClassId='+trainingClassId;
      divisionId= (!divisionId || divisionId == 'null')?'':'&divisionId='+divisionId;
      departmentId= (!departmentId || departmentId == 'null')?'':'&departmentId='+departmentId;
      subResortId=   (!subResortId || subResortId == 'null')?'':'&subResortId='+subResortId;
      createdBy =(!createdBy || createdBy == 'null')?'':'&createdBy='+createdBy;
      status = (!status || status == 'null')?'':status;
      courseStatus = (!courseStatus || courseStatus == 'null')?'':'&courseStatus='+courseStatus;
      search = (search == '') ? '': '&search='+search
      query = courseId+trainingClassId+subResortId+divisionId+departmentId+createdBy+search+courseStatus;

    }
    return query;
  }
  getIndividualCourse(courseId){
    return this.http.getLocal('local',this.url.getCourseById+'?courseId='+courseId);
  }
  addCourseDuplicate(params){
    return this.http.post('local',this.url.addDuplicateCourse,params);
  }

  getEmployeeListDetails(resortId,courseId){
    let query = resortId ? '?resortId='+resortId+'&courseId='+courseId : '?courseId='+courseId;
    return this.http.getLocal('local',this.url.getEmployeeList+query);
  }

  getEmployeeDetails(query){
    return this.http.getLocal('local',this.url.getEmployeeDetails+query);
  }

  getCalendarSchedule(resortId){
    return this.http.getLocal('local',this.url.getScheduleTraining+'?resortId='+resortId);
  }
  getPopupSchedule(scheduleId){
    return this.http.getLocal('local',this.url.getPopupScheduleData+'?trainingScheduleId='+scheduleId);
  }
  updateScheduleTraining(scheduleId,params){
    //updateScheduleTraining
    return this.http.put('local',this.url.updateScheduleTraining+scheduleId,params)
  }

  setPermission(params){
    return this.http.post('local',this.url.setPermissions,params);
  }

  addTypeOneNotification(params){
    return this.http.post('local',this.url.addTypeOneNotification,params);
  }

  addTypeTwoNotification(params){
    return this.http.post('local',this.url.addTypeTwoNotification,params);
  }

  getNotification(query){
    return this.http.getLocal('local',this.url.getNotification+query);
  }

  updateNotification(notifyId,params){
    // updateNotification
    return this.http.put('local',this.url.updateNotification+notifyId,params)
  }

  removeSchedule(scheduleId){
    return this.http.delete('local',this.url.removeSchedule+scheduleId)
  }

  getTrainingClassList(page,size,query){
    let user = this.utilService.getUserData();
    return this.http.getLocal('local',this.url.getTrainingClassList+'?page='+page+'&size='+size+query);
  }
  getDropTrainingClassList(query){
    return this.http.getLocal('local',this.url.dropdownTCList+query);
  }
  sendApproval(post){
    return this.http.post('local',this.url.sendApproval,post);
  }

  getPermissionList(query){
    // permissionUserList
    return this.http.getLocal('local',this.url.permissionUserList+query);
  }

  getCourseForNotification(query){
    // getCourseByResort
    return this.http.getLocal('local',this.url.getCourseByResort+query);
  }


}
