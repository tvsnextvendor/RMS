import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';
import { UtilService } from '../util.service';
import { API_URL } from '../../Constants/api_url';
import {API} from '../../../app/Constants/api';

@Injectable({    
    providedIn: 'root'
})
export class CommonService {

  url;

  constructor (private http: HttpService, private utilService : UtilService) {
       this.url = API_URL.URLS;
  }
  getResortName() {
    
    let resortName = localStorage.getItem("resortName") != '0' ? localStorage.getItem("resortName") : 'Network Admin';
    return resortName;
    }

  
  readAllNotification(){
    let userData = this.utilService.getUserData();
    let userId = userData.userId;
    return  this.http.put('local', this.url.readAllNoti+ '/' + userId,'');
  }


 getDivisionList(){
    return this.http.getLocal('local',this.url.divisionList);
 }
 getCreatedByDetails(){
    return this.http.getLocal('local',this.url.getCreatedByDetails);
  }

  getCreatedByDetailsByResort(query){
    return this.http.getLocal('local',this.url.getCreatedByDetails+query);
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

getResortList(query){
    return this.http.getLocal('local',this.url.resortList+query);
}

getParentChildResorts(resortId){
  return this.http.getLocal('local',this.url.resortList+'?Resort='+resortId);
}
getResortByParentId(resortId){
  return this.http.getLocal('local',this.url.getResortDivision+'?Resort='+resortId+'&type=division')
}

getDesignationList(resortId){
    return this.http.getLocal('local',this.url.designationList+'?resortId='+resortId);
}

uploadFiles(file){
    const formData = new FormData();
    formData.append("file",file)
    return this.http.upload('local',this.url.uploadFiles, formData);
}

videoUploadFiles(file){
  const formData = new FormData();
  formData.append("file",file)
  let url = API.AWS ? this.url.videoTrans : this.url.uploadFiles;
  return this.http.upload('local',url, formData);
}

updateFiles(id,file){
   return this.http.put('local',this.url.updateFiles+'/' + id,file);
}

removeFiles(params){
  let url = API.AWS ? this.url.removeTrans : this.url.removeFiles;
    return this.http.removeFile('local',url, params);
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
    feedback = '?resortId=' + feedbackObj.resortId + '&feedbackType=' + feedbackObj.feedbackType+"&createdBy="+feedbackObj.createdBy;
  } else {
    feedback = '?resortId=' + feedbackObj.resortId + '&courseId=' + feedbackObj.courseId + '&trainingClassId=' + feedbackObj.trainingClassId + '&feedbackType=' + feedbackObj.feedbackType+"&createdBy="+feedbackObj.createdBy;
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
getCertificateTrend(obj,query) {
  return this.http.getLocal('local', this.url.getCertificateTrend + '?year=' + obj.year + query);
}
certificateTrendCount(query){
  // console.log(query);
  return this.http.getLocal('local', this.url.certificateTrendCount+query );
}
certificateTrendCountDetail(query){
  return this.http.getLocal('local', this.url.certificateTrendCountDetail+'?courseId='+query.courseId+'&resortId='+query.resortId+'&search='+query.search+'&userId='+query.userId);
}
getCertificateTrendList(query){
  return this.http.getLocal('local', this.url.getCertificateTrendList+query );
}
getCourseTrendListList(courseTrendObj,query) {
  return this.http.getLocal('local', this.url.getCourseTrendListList + '?year=' + courseTrendObj.year + query + '&month=' + courseTrendObj.month);
}
getCourseTrendList(courseTrendObj,query) {
  return this.http.getLocal('local', this.url.getCourseTrendList + '?year=' + courseTrendObj.year + query + '&month=' + courseTrendObj.month);
}

getCourseEmployeeList(query, courseId,type) {
  let typeQuery = type == 'course' ?  '?courseId=' + courseId : (type == 'class' ? '?trainingClassId=' + courseId : '?notificationFileId=' + courseId);
  return this.http.getLocal('local', this.url.getCourseEmployeeList + typeQuery + query );
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
  return this.http.getLocal('local', this.url.resortList + '?Resort=' + resortId);
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

getAllResort(query){
  return this.http.getLocal('local', this.url.getAllResort + query);
}

getExpireTrendList(query,courseId,type){
  let id = type == 'course' &&  courseId ? '?courseId='+courseId : type == 'class' && courseId ? '?trainingClassId='+courseId : '' ;
  return this.http.getLocal('local', this.url.expireTrend +id+query);
}
getClassTrendList(courseTrendObj,query) {
  return this.http.getLocal('local', this.url.getTrainingClassByYear + '?year=' + courseTrendObj.year + query + '&month=' + courseTrendObj.month);
}
getReportingManager(query){
  return this.http.post('local', this.url.getReportingManager, query);
}
sendExpireNotification(params){
  return this.http.post('local', this.url.sendExpireNotification, params);
}
getNotificationTrendList(courseTrendObj,query) {
  return this.http.getLocal('local', this.url.getAllNotificationsByMonth + '?year=' + courseTrendObj.year + query + '&month=' + courseTrendObj.month);
}
}
