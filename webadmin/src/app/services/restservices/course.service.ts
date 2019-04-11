import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';

@Injectable({    
    providedIn: 'root'
})
export class CourseService {
  constructor (
    private http: HttpService
  ) {}


  addCourse(userData){
    return this.http.post('local','course/Add', userData);
  }

  getCourse(){
    return this.http.getLocal('local','course/List');
  }

  getCourseById(courseId){
    return this.http.getLocal('local','course/List?courseId='+courseId)
  }


  updateCourse(courseId, userData){
      return this.http.put('local','course/Update/'+courseId,userData)
  }

  deleteCourse(courseId){
    return this.http.delete('local','course/Delete/',+courseId)
  }

  addTrainingClass(userData){
    return this.http.post('local','trainingClass/Add', userData);
  }

  getTrainingClass(){
    return this.http.getLocal('local','trainingClass/List');
  }

  getTrainingClassById(trainingClassId){
    return this.http.getLocal('local','trainingClass/List?trainingClassId='+trainingClassId)
  }

}
