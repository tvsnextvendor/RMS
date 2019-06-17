import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';
import { API_URL } from '../../Constants/api_url';

@Injectable({    
    providedIn: 'root'
})
export class CommonService {

  url;

  constructor (private http: HttpService) {
       this.url = API_URL.URLS;
  }
  getResortName() {
    
    let resortName = localStorage.getItem("resortName") != '0' ? localStorage.getItem("resortName") : 'Network Admin';
  // console.log(localStorage.getItem("resortName"))
    return resortName;
    }

 getDivisionList(){
    return this.http.getLocal('local',this.url.divisionList);
 }
 getCreatedByDetails(){
    return this.http.getLocal('local',this.url.getCreatedByDetails);
  }

 getDepartmentList(data){
      let params = data ? data : '';
      if(params){    
        return this.http.post('local',this.url.departmentList,params);
      }else{
        return this.http.post('local',this.url.departmentList,'');
      }
 }

 getRoleList(){
     return this.http.getLocal('local',this.url.roleList);
 }

getResortList(id){
    return this.http.getLocal('local',this.url.resortList+'?createdBy='+id);
}

getDesignationList(resortId){
    return this.http.getLocal('local',this.url.designationList+'?resortId='+resortId);
}

uploadFiles(file){
    const formData = new FormData();
    formData.append("file",file)
    return this.http.upload('local',this.url.uploadFiles, formData);
}

removeFiles(params){
    return this.http.removeFile('local',this.url.removeFiles, params);
}

getResortDivision(id){
    return this.http.getLocal('local',this.url.resortDivisionList+id);
}

passwordUpdate(params){
  return this.http.put('local',this.url.userSettings,params);
}

addBadges(params){
  return this.http.post('local',this.url.badge,params);
}

updateBadge(params){
  return this.http.put('local',this.url.badge,params);
}

getBadge(id){
  return this.http.getLocal('local',this.url.badge+'?resortId='+id);
}

addCertificate(certificateData) {
  return this.http.post('local', this.url.addCertificate, certificateData);
}

deleteCertificate(id){
    return this.http.delete('local',this.url.deleteCertificate+'/'+id)
  }

getCertificate(id) {
  return this.http.getLocal('local', this.url.getCertificate + '?resortId=' + id);
}

getParticularCertificate(certificateId, resortId) {
  return this.http.getLocal('local', this.url.getCertificate + '?certificateId=' + certificateId + '&resortId' + resortId);
}

updateCertificate(certificateId, updationData) {
  return this.http.put('local', this.url.certificate + certificateId, updationData);
}

getFeedbackList(feedbackObj) {
  let feedback;
  if (feedbackObj.feedbackType === 'app') {
    feedback = '?resortId=' + feedbackObj.resortId + '&feedbackType=' + feedbackObj.feedbackType;
  } else {
    feedback = '?resortId=' + feedbackObj.resortId + '&courseId=' + feedbackObj.courseId + '&trainingClassId=' + feedbackObj.trainingClassId + '&feedbackType=' + feedbackObj.feedbackType;
  }
  return this.http.getLocal('local', this.url.feedbackList + feedback);
}
assignCertificate(params){
  return this.http.post('local', this.url.assignCertificate, params);
}
getAssignCertificate(id){
  //getAssignCertificate
  return this.http.getLocal('local',this.url.getAssignCertificate+'?resortId='+id);
}

getTotalCount(query) {
  return this.http.getLocal('local', this.url.totalCount + query);
}

getTotalCourse(query) {
  return this.http.getLocal('local', this.url.totalCourse + query);
}

getTopRatedTrainingClasses(query) {
  return this.http.getLocal('local', this.url.ratedTrainingClasses + query);
}

getCourseTrend(courseTrendObj,query) {
  return this.http.getLocal('local', this.url.getCourseTrend + '?year=' + courseTrendObj.year + query);
}

getCourseTrendList(courseTrendObj,query) {
  return this.http.getLocal('local', this.url.getCourseTrendList + '?year=' + courseTrendObj.year + query + '&month=' + courseTrendObj.month);
}

getCourseEmployeeList(query, courseId) {
  return this.http.getLocal('local', this.url.getCourseEmployeeList + query + '&courseId=' + courseId);
}

getTopFiveResort(query){
  // topFiveResort
  return this.http.getLocal('local', this.url.topFiveResort +query);
}

forgetPassword(params){
  return this.http.post('local', this.url.forgetPassword, params);
}
resetPassword(params){
  return this.http.reset('local', this.url.resetPassword, params);
}

getBadges(query) {
  return this.http.getLocal('local', this.url.badgesData + query);
}

getResortForFeedback(resortId) {
  return this.http.getLocal('local', this.url.resortList + '?parentId=' + resortId);
}

saveAsNew(courseId, data) {
  return this.http.post('local', this.url.saveAsNewVersion + '/' + courseId, data);
}

getArchieve(query){
  return this.http.getLocal('local', this.url.archievedSettings + query);
}

addArchieve(params){
  return this.http.post('local', this.url.archievedSettings, params);
}
updateArchieve(archieveId,params){
  return this.http.put('local', this.url.archievedSettings+'/'+ archieveId, params);
}
removeArchieve(archieveId){
  return this.http.delete('local', this.url.archievedSettings+'/'+ archieveId);
}

}
