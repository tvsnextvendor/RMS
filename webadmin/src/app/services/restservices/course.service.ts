import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';
import { API_URL } from '../../Constants/api_url';

@Injectable({    
    providedIn: 'root'
})
export class CourseService {
  
  url;

  constructor (private http: HttpService) {
     this.url = API_URL.URLS;
  }


  addCourse(userData){
    return this.http.post('local',this.url.courseAdd, userData);
  }

  getCourse(currentPage,size){
    return this.http.getLocal('local',this.url.courseList+'?page='+currentPage+'&size='+size);
  }

  getAllCourse(){
    return this.http.getLocal('local',this.url.courseList);
  }

  getCourseById(courseId){
    return this.http.getLocal('local',this.url.courseList+'?courseId='+courseId)
  }


  updateCourse(courseId, userData){
      return this.http.put('local',this.url.courseUpdate+courseId,userData)
  }

  deleteCourse(courseId){
    return this.http.delete('local',this.url.courseDelete+courseId)
  }

  deleteDocument(docId){
    return this.http.delete('local',this.url.fileDelete+docId)
  }

  addTrainingClass(userData){
    return this.http.post('local',this.url.trainingClassAdd,userData);
  }

  getCourseTrainingClass(currentPage,size){
    // return this.http.getLocal('local',this.url.trainingClassCourse+'?page='+currentPage+'&size='+size);
    return this.http.getLocal('local',this.url.trainingClassCourse);
  }

  getTrainingClass(){
    return this.http.getLocal('local',this.url.trainingClass);
  }

  getTrainingClassById(trainingClassId){
    return this.http.getLocal('local',this.url.trainingClass+'?trainingClassId='+trainingClassId)
  }

  getTrainingClassQuiz(trainingClassId,courseId){
    return this.http.getLocal('local',this.url.trainingClassQuiz+'?trainingClassId='+trainingClassId+'&courseId='+courseId)
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

  getCreatedByDetails(){

    return this.http.getLocal('local',this.url.getCreatedByDetails);
  }

  getFiles(fileType,page,size){

    return this.http.getLocal('local',this.url.fileList+'?fileType='+fileType+'&page='+page+'&size='+size);
  }

  getEditCourseDetails(courseId,classId){
    return this.http.getLocal('local',this.url.courseEditFileList+'?courseId='+courseId+'&trainingClassId='+classId);
  }

  updateCourseList(courseId,params){
    return this.http.put('local',this.url.courseListUpdate+courseId,params)
  }
  updateQuizList(quizId,params){
    return this.http.put('local',this.url.quizListUpdate+quizId,params)
  }
  deleteQuizList(queId){
    return this.http.delete('local',this.url.quizDelete+queId)
  }
}
