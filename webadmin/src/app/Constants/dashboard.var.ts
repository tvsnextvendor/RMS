import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardVar {

  topEmployees = [];
  topResorts   = [];
  courses;
  url;
  keyStat;
  badgesCertification;
  newEmployee;
  weekGrowth;
  moduleList;
  moduleType=null;
  yearList;
  years="2018";
  taskChart;
  courseTrendData;
  title = 'Dashboard';
  select= 'Module';
  recentComments;
  employeeTabLabel = 'Employee';
  resortTabLabel   = 'Resort';
  recentComment    = 'Recent Comment';
  employeeTabText  = {
    'wishes' : 'Good Morning',
    'name' : 'Adams',
    'notification' : 'You have 5 important tasks today, Some messages and notifications. Finish them all! Or you can also'
  };
  symbols = {
     comma : ',',
     apostrophe : '!',
     percentage : '%'

  };
  btns = {
     editTasks    : 'Edit Tasks',
     quickTasks   : 'Quick Tasks',
     openCalendar : 'Open Calendar'
  };
  employeeGridsTitle = {
     totalCourses     : 'Total Courses',
     availableCourses : 'Assigned Courses',
     completedCourses : 'Completed Courses',
     inProgress       : 'In Progress',
     videosTrend      : 'Course Trend',
     employeeProgress : 'Employee Progress',
     totalNoOfBadges  : 'Total No. of Badges',
     certificationTrend : 'Employee Certification Trend',
     topEmployees : 'Top 5 Employees',
     topCourses   : 'Top Rated Courses',
     keyStats     : "Key Stats",
     name         : "Name",
     module       : "Module",
     score        : "Score"
  };

  resortGridsTitle = {
     visitors         : 'Visitors',
     staff            : 'Staff',
     feedbackRating   : 'Feedback & Rating',
     visitorsByResort : 'Visitors By Resort',
     reservationByResort : 'Reservation By Resort',
     topResorts       : 'Top 10 Resorts',
     resort           : 'Resort',
     badges           : 'Badges',
     certification    : 'Certification'
  };






}
