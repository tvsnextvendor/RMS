import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';
import {API} from '../../Constants/api';

@Injectable({    
    providedIn: 'root'
})
export class CourseService {
  
   port = '3003/';

  constructor (private http: HttpService) {
  }


  addCourse(userData){
    return this.http.post('local',this.port,'course/Add', userData);
  }

  getCourse(currentPage,size){
    return this.http.getLocal('local',this.port,'course/List?page='+currentPage+'&size='+size);
  }

  getAllCourse(){
    return this.http.getLocal('local',this.port,'course/List');
  }

  getCourseById(courseId){
    return this.http.getLocal('local',this.port,'course/List?courseId='+courseId)
  }


  updateCourse(courseId, userData){
      return this.http.put('local',this.port,'course/Update/'+courseId,userData)
  }

  deleteCourse(courseId){
    return this.http.delete('local',this.port,'course/Delete/',+courseId)
  }

  addTrainingClass(userData){
    return this.http.post('local',this.port,'trainingClass/Add', userData);
  }

  getCourseTrainingClass(currentPage,size){
    return this.http.getLocal('local',this.port,'trainingClass/List?page='+currentPage+'&size='+size);
  }

  getTrainingClass(){
    return this.http.getLocal('local',this.port,'trainingClass/trainingList');
  }

  getTrainingClassById(trainingClassId){
    return this.http.getLocal('local',this.port,'trainingClass/trainingList?trainingClassId='+trainingClassId)
  }

  getTrainingClassQuiz(trainingClassId,courseId){
    return this.http.getLocal('local',this.port,'trainingClass/QuizList?trainingClassId='+trainingClassId+'&courseId='+courseId)
  }

  getDivision(resortId,resortType){
      let resort = resortType === "parent" ? 'parentResort='+resortId : 'childResort='+resortId
      return this.http.getLocal('local',this.port,'resort/getresortDivision?'+resort+'&type=division');
  }

  getChildResort(resortId){
    return this.http.getLocal('local',this.port,'resort/getresortDivision?childResort='+resortId);
  }

  getDepartment(divisionId){
    let port = '3002/'
    return this.http.post('local',port,'department/List',{'divisionId':divisionId});
  }

  getCreatedByDetails(){
   //  let port = '3002/'
    return this.http.getLocal('local',this.port,'course/getCreatedByDetails');
  }

  getFiles(fileType){
    // let port = '3002/'
    return this.http.getLocal('local',this.port,'trainingClass/fileList?fileType='+fileType);
  }
}
