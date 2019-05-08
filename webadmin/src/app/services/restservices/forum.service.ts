import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';
import { API_URL } from '../../Constants/api_url';
import { UtilService } from '../../services/util.service';

@Injectable({
    providedIn: 'root'
}) 
export class ForumService {
  url;
  public editForum = new BehaviorSubject('');
  public listPage = new BehaviorSubject('');
//   userData;
  constructor (private http: HttpService,
    private utilService: UtilService) {
          this.url = API_URL.URLS;
        //   this.userData = this.utilService.getUserData;
  }

  addForum(userData) {
    return this.http.post('local', this.url.forum, userData);
  }

  getForumList(pageDetails) {
    // let query;
    // if (pageDetails.currentPage) {
    //   query = 
    // } else {
    //   query = '?forumId' + pageDetails.forumId;
    // }
      return this.http.getLocal('local', this.url.forum + '?page=' + pageDetails.currentPage + '&size=' + pageDetails.pageSize);
  }

  getAdmin() {
      return this.http.getLocal('local', this.url.userList);
  }

  getDivision() {
      return this.http.getLocal('local', this.url.divisionList + '?resortId=' + this.utilService.getUserData().Resorts[0].resortId);
  }

  getDepartment(divisonIds) {
      return this.http.post('local', this.url.departmentList, divisonIds);
  }

  editPage(forumStatus) {
    this.editForum.next(forumStatus);
  }

  deleteForum(forumId) {
    return this.http.delete('local', this.url.forum + '/' + forumId);
  }

  getForumById(forumId) {
    return this.http.getLocal('local', this.url.forum + '?forumId=' + forumId);
  }

  forumUpdate(forumId, data) {
    return this.http.put('local', this.url.forum + '/' + forumId, data);
  }

  goToList(list) {
    this.listPage.next(list);
  }

  postList(forumId) {
    return this.http.getLocal('local', this.url.forumPost + '?forumId=' + forumId);
  }
}
