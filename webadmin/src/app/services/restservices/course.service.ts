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

  getCourse(currentPage,size,query){
    return this.http.getLocal('local',this.url.courseList+'?page='+currentPage+'&size='+size+query);
  }

  getAllCourse(){
    return this.http.getLocal('local',this.url.courseList);
  }

  getCourseById(courseId){
    return this.http.getLocal('local',this.url.courseList+'?courseId='+courseId)
  }

  getTrainingclassesById(courseId){
    return this.http.getLocal('local',this.url.getTrainingClassById+'?courseId='+courseId)
  }
  updateCourse(courseId, userData){
      return this.http.put('local',this.url.courseUpdate+courseId,userData)
  }
  updateTrainingClassName(trainingClassId, trainingClassName) {
    return this.http.put('local', this.url.trainingClassUpdate + trainingClassId, trainingClassName)
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

  getFiles(fileType,classId,page,size,query){
    if(classId === ''){
      return this.http.getLocal('local',this.url.fileList+'?fileType='+fileType+'&page='+page+'&size='+size+query);
    }
    else{
      return this.http.getLocal('local',this.url.fileList+'?fileType='+fileType+'&trainingClassId='+classId+'&page='+page+'&size='+size+query);
    }
    
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
  searchQuery(CMSFilterSearchEventSet){
    let query = '';
    if(CMSFilterSearchEventSet !== undefined && CMSFilterSearchEventSet !== '')
    {
      let courseId           = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.courseId)?CMSFilterSearchEventSet.courseId:'';
      let trainingClassId    = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.trainingClassId)?CMSFilterSearchEventSet.trainingClassId:'';
      let divisionId         = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.parentDivisionId)?CMSFilterSearchEventSet.parentDivisionId:((CMSFilterSearchEventSet && CMSFilterSearchEventSet.childDivisionId)?CMSFilterSearchEventSet.childDivisionId:'');
      let departmentId       = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.parentDepartmentId)?CMSFilterSearchEventSet.parentDepartmentId:((CMSFilterSearchEventSet && CMSFilterSearchEventSet.childDepartmentId)?CMSFilterSearchEventSet.childDepartmentId:'');
      let subResortId        = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.childResortId)?CMSFilterSearchEventSet.childResortId:'';
      let createdBy          = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.createdBy)?CMSFilterSearchEventSet.createdBy:'';
      let search             = (CMSFilterSearchEventSet && CMSFilterSearchEventSet.search)?CMSFilterSearchEventSet.search:''

      courseId=  (courseId == 'null')?'':courseId;
      trainingClassId = (trainingClassId == 'null')?'':trainingClassId;
      divisionId= (divisionId == 'null')?'':divisionId;
      departmentId= (departmentId == 'null')?'':departmentId;
      subResortId=   (subResortId == 'null')?'':subResortId;
      createdBy =(createdBy == 'null')?'':createdBy;
      query = '&courseId='+courseId+'&trainingClassId='+trainingClassId+'&subResortId='+subResortId+'&divisionId='+divisionId+'&departmentId='+departmentId+'&createdBy='+createdBy+'&search='+search;

    }
    return query;
  }
}
