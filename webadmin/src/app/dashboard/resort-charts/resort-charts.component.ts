import { Component, OnInit,Input } from '@angular/core';
import { DashboardVar } from '../../Constants/dashboard.var';
import { HttpService,CommonService,UtilService,CourseService,ResortService } from '../../services';
declare var require: any;
const Highcharts = require('highcharts');
import Chart from 'chart.js';
import { API_URL } from 'src/app/Constants/api_url';
import { Router } from '@angular/router';
import {CommonLabels} from '../../Constants/common-labels.var';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

@Component({
    selector: 'app-resort-charts',
    templateUrl: './resort-charts.component.html',
    styleUrls: ['./resort-charts.component.css']
})
export class ResortChartsComponent implements OnInit {
    donutChartData = [];
    donutEnable = false;
    Badges = [];
    BadgesCertificate = [];
    todayDate;
    TtlDivision = 0;
    TtlDepartment = 0;
    TtlEmployee = 0;
    userRole ;
    resortId;
    topCourses;
    hideCharts;
    resortList =[];
    resortChildList = [];
    selectedResort = null;
    selectedParentResort = null;
    roleId;
    userId;
    userName;
    resortName;
    filterDivision = null;
    filterDept = null;
    divIds;
    allDivisions;
    deptIds;
    allDepartments;
    divisionList = [];
    departmentList = [];
    @Input() notificationCount;

    constructor(public dashboardVar: DashboardVar,
         private http: HttpService,
         private route: Router,
         public commonLabels:CommonLabels,
         private commonService : CommonService,
         private mScrollbarService: MalihuScrollbarService,
         private utilService :UtilService,
         private courseService :CourseService,
         private resortService :ResortService) {
        this.dashboardVar.url = API_URL.URLS;
    this.dashboardVar.userName = this.utilService.getUserData().firstName + ' '+this.utilService.getUserData().lastName;
    this.hideCharts = this.utilService.getRole() === 2 ? false : true;
    this.resortId = this.utilService.getUserData().ResortUserMappings.length && this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
    this.resortName = this.utilService.getUserData().ResortUserMappings.length && this.utilService.getUserData().ResortUserMappings[0].Resort.resortName;
    this.userId = this.utilService.getUserData().userId;
    this.divIds = this.utilService.getDivisions() ? this.utilService.getDivisions() : '';
    this.deptIds = this.utilService.getDepartment() ? this.utilService.getDepartment() : '';
    
    }

    ngAfterViewInit() {
      this.mScrollbarService.initScrollbar('.sidebar-wrapper', { axis: 'y', theme: 'minimal-dark' });
      this.getcertificateTrend('');
      this.totalNoOfBadges('');
      this.getCountDetails(this.resortId,'');
    }
    ngOnInit() {
        // this.getData();
        this.roleId = this.utilService.getRole();
        let userDetails = this.utilService.getUserData();
        this.userName = this.utilService.getUserData().firstName + ' '+this.utilService.getUserData().lastName;
        this.getKeyStat();
        this.filterSelect('','resort');
        
        this.dashboardVar.years = '2019';
        this.dashboardVar.certYear = '2019';
        this.userRole = this.utilService.getRole();
        
        if(this.roleId == 1){
          this.getResortDetails();
        }
        else{
          this.selectedParentResort = this.resortId;
          this.getChildResort('');
        }
    }

    getCountDetails(resortId,queries){
        this.resortId = resortId;
        let query =  this.resortId ? '?resortId='+ this.resortId : '';
        if(this.roleId == 4){
          query = query+'&userId='+this.userId;
        }
        if(queries){
          query =  query + queries;
        }
        this.commonService.getTotalCourse(query).subscribe(result => {
            const totalCourses = result.data.training;
            this.dashboardVar.totalCoursesCount = result.data.courseTotalCount;
            this.dashboardVar.totalCourses = totalCourses.map(item => {
              return {name: item.status[0].toUpperCase() + item.status.substr(1).toLowerCase(), y: parseInt(item.totalcount, 10)};
            });
            this.totalCoursesLine();
          });
          setTimeout(() => {
            // this.totalStorageSpace();
          }, 2000);
          this.commonService.getTotalCount(query).subscribe(result => {
            const data = result.data;
            this.TtlDivision = data.divisionCount;
            this.TtlDepartment = data.departmentCount;
            this.TtlEmployee = data.employeeCount;
          });
        this.topRatedCourses('');
        this.getcourseTrend('');
        this.getcertificateTrend('');
       
    }
    selectResort(){
      this.resortId = (this.selectedResort)?this.selectedResort:this.selectedParentResort;
      this.getCountDetails(this.resortId,'');
      this.totalNoOfBadges('');
    }

    getResortDetails(){
        let roleId = this.utilService.getRole();
        // Get All Parents N/W Admin
        let query = '?parents='+roleId;
        if(this.roleId == 4){
          query = query+'&userId='+this.userId;
        }
        this.commonService.getAllResort(query).subscribe((result) => {
          if(result && result.isSuccess){
            this.resortList = result.data ? result.data : [];
          }else{
            this.resortList = [];
          }
        });
    }

    getChildResort(resortId){
      // get All Childs From Parents
      let query = '?parentId='+ (resortId ? resortId : this.resortId);
      if(this.roleId == 4){
        query = query+'&userId='+this.userId;
      }
      this.commonService.getAllResort(query).subscribe((result) => {
          if(result && result.isSuccess){
            this.resortChildList = result.data  ? result.data : [];
          }
        });
    }


    getData() {
         // //get Task stackbar chart data
        // this.http.get(this.dashboardVar.url.getTaskResortChart).subscribe((data) => {
        //     this.dashboardVar.taskChart = data.Tasks;
        // })

        // //get Feedback & Rating data
        // this.http.get(this.dashboardVar.url.getFeedbackRating).subscribe((data) => {
        //     this.dashboardVar.feedbackData = data;
        // })

        // this.http.get(this.dashboardVar.url.getResortList).subscribe((data) => {
        //     this.dashboardVar.resortList = data.resortList;
        // })

        // this.http.get(this.dashboardVar.url.getvisitorsByResorts).subscribe((data) => {
        //     this.dashboardVar.visitorsResort = data.resorts;
        // })

        // this.http.get(this.dashboardVar.url.getVisitorsStaffData).subscribe((data) => {
        //     this.dashboardVar.visitorsData = data.visitorsData;
        //     this.dashboardVar.staffData = data.staffData;

        // })

        // this.topResorts();
        // this.badgesCertification();
        // this.getKeyStat();
        // setTimeout(() => {
        //     this.visitorsByResortPie();
        //     this.visitorsLineChart();
        //     this.staffLineChart();
        //     this.totalEmployeeLineChart();
        //     this.taskStackbar();
        //     this.feedbackrating();
        //     this.reservationByResort();
        // }, 1000);
      }

    getKeyStat() {
        this.http.get(this.dashboardVar.url.getKeyStat).subscribe((data) => {
            const keyStat = data;
            this.dashboardVar.newEmployee = keyStat.NewEmployees;
            this.dashboardVar.weekGrowth = keyStat.WeeklyGrowth;
            this.dashboardVar.recentComments = keyStat.RecentComments;

        });
    }


    topResorts() {
        this.http.get(this.dashboardVar.url.getTopResorts).subscribe((data) => {
            this.dashboardVar.topResorts = data.resortCharts.TopResorts;
        });
    }

    totalNoOfBadges(queries) {
      let query = this.resortId ? '?resortId='+this.resortId : '';
      if(this.roleId == 4){
        query = query+'&userId='+this.userId;
      }
      if(queries){
        query = query + queries;
      }
      this.commonService.getBadges(query).subscribe((resp) => {
        const donutChartData = resp.data.badges;
        if(donutChartData.length == 0){
          this.dashboardVar.totalBadges = resp.data.badges.length;
        }else{
          this.dashboardVar.totalBadges = resp.data.totalCount;
        }
        this.dashboardVar.totalNoOfBadges = donutChartData.map(item =>
            [item.Badge.badgeName , parseInt(item.totalcount, 10)]
        );
        this.chartContainer();
        });
    }
    goToVideosTrend() {
      this.route.navigateByUrl('/videostrend');
    }

    //Navigate to certification trend list page
    goTocertificationTrend(){
      this.route.navigateByUrl('/certification/trend');
    }

  
  changeCertificationYear(){
    this.getcertificateTrend('');
  }


  getcertificateTrend(queries) {
    const certificationTrend = {
      year : this.dashboardVar.years
    };
   // let query =  '&resortId=' + this.resortId + '&createdBy=' + this.userId;
    let query = this.resortId ? '&resortId='+this.resortId : '';
    if(this.roleId == 4){
      query = query+'&userId='+this.userId;
    }
    if(queries){
      query = query + queries;
    }
    this.commonService.getCertificateTrend(certificationTrend,query).subscribe(result => {
      if (result && result.isSuccess) {
        this.dashboardVar.certificationTrend = result.data.map(item => parseInt(item, 10));
        //setTimeout(()=>{
          this.certificationTrend();
        //},100) 
      }
    });
  }


    certificationTrend() {
    Highcharts.chart('certificationTrend', {
      credits: {
        enabled: false
      },
      chart: {
        type: 'spline',
      },
      title: {
        text: '',
        style: {
          display: 'none'
        }
      },
      xAxis: {
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        crosshair: true
    },
      yAxis: {
        opposite: true,
        display: false,
        title: {
          text: null
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'bottom'
    },
    series:  [{name:'Employess',    showInLegend: false,data:this.dashboardVar.certificationTrend}],
    colors: ['#7DB5EC', '#CCCCCC'],
    // stroke:'grey',
  });
  }


    chartContainer() {
      Highcharts.chart('chartContainer', {
        chart : {
           plotBorderWidth: null,
           plotShadow: false,
           type: 'pie'
        },
        credits: {
          enabled: false
        },
        title : {
           text: '',
           verticalAlign: 'middle',
           align: 'center',
           y: 40,
           style: {
          color: '#333333',
          fontSize: '19px',
          fill: '#333333'
           }
        },
        tooltip : {
           pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions : {
           pie: {
              shadow: false,
              center: ['50%', '50%'],
              size: '100%',
              innerSize: '70%'
           },
        //    series: {
        //     dataLabels: {
        //         enabled: true,
        //         formatter: function() {
        //             return Math.round(this.percentage * 100) / 100 + ' %';
        //         },
        //         distance: -30,
        //         color: 'white'
        //     }
        // }
        },
        series : [{
          name: 'Badges',
           data:
            this.dashboardVar.totalNoOfBadges
        }]
    }
      );
    }

    addQuickTasks() {
        this.todayDate = new Date();
        localStorage.setItem('BatchStartDate', this.todayDate);
        this.route.navigateByUrl('/addBatch');
    }
    onChangeYear(){
      this.getcourseTrend('')
    }

    topRatedCourses(queries) {
      let query = this.resortId ? '?resortId='+this.resortId : '';
      if(this.roleId == 4){
        query = query+'&userId='+this.userId;
      }
      if(queries){
        query = query + queries
      }
        this.commonService.getTopRatedTrainingClasses(query).subscribe((result) => {
          if (result && result.isSuccess) {
            this.topCourses = result.data.map(item => {
              return {id: item.trainingClassId, courseName: item.trainingClassName, rating: item.ratingStar};
            });
          }
        });
      }
    
      getcourseTrend(queries) {
        const courseTrendObj = {
          year : this.dashboardVar.certYear
        };
        let query = this.resortId ? '&resortId='+this.resortId : '';
        if(this.roleId == 4){
          query = query+'&userId='+this.userId;
        }
        if(queries){
          query = query + queries;
        }
        this.commonService.getCourseTrend(courseTrendObj,query).subscribe(result => {
          if (result && result.isSuccess) {
            this.dashboardVar.courseTrendData = result.data.map(item => parseInt(item, 10));
            this.courseTrend();
          }
        });
      }
      totalCoursesLine() {
        Highcharts.chart('totalCourses', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: ''
          },
          credits: {
            enabled: false
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false
              },
              showInLegend: true
            },
            series: {
              dataLabels: {
                  enabled: true,
                  formatter: function() {
                      return (this.y);
                  },
                  distance: -30,
                  color: 'white'
              }
          }
          },
          series: [{
            name: 'Courses',
            colorByPoint: true,
            data: this.dashboardVar.totalCourses
          }]
        });
    
      }
    
      totalStorageSpace() {
        Highcharts.chart('totalStorageSpace', {
          chart : {
             plotBorderWidth: null,
             plotShadow: false,
             type: 'pie'
          },
          title : {
             text: 'Total Space 100GB',
             verticalAlign: 'middle',
             align: 'center',
             y: 40,
             style: {
            color: '#333333',
            fontSize: '19px',
            fill: '#333333'
             }
          },
          tooltip : {
             pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions : {
             pie: {
                shadow: false,
                center: ['50%', '50%'],
                size: '45%',
                innerSize: '70%'
             }
          },
          series : [{
             data: [
                ['Firefox',   45.0],
                ['IE',       26.8],
                ['Chrome', 12.8],
                ['Safari',    8.5],
                ['Opera',     6.2],
                ['Others',      0.7]
             ]
          }]
       });
      }
    
      courseTrend() {
        Highcharts.chart('trend', {
          chart: {
              type: 'column'
          },
          credits: {
            enabled: false
          },
          title: {
              text: ''
          },
          xAxis: {
              categories: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec'
              ],
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: ''
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0
              }
          },
          series: [{
            name: 'Total no. of Courses',
            data: this.dashboardVar.courseTrendData
        }]
      });
      }

      filterSelect(value,type){
        let resortId = this.utilService.getUserData().ResortUserMappings.length && this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
        if(type == "resort"){
            this.filterDivision =null;
            this.filterDept = null;
            // this.resortService.getResortByParentId(resortId).subscribe((result) => {
            //     if (result.isSuccess) {
            //         this.divisionList = result.data && result.data.divisions ? result.data.divisions : [];
            //         let query = "&resortId="+resortId;
            //     }
            // })
            this.resortService.getResortByParentId(resortId).subscribe((result) => {
                if (result.isSuccess) {
                      this.allDivisions = result.data.divisions;
                    if (this.divIds.length > 0 && this.roleId === 4) {
                        this.divisionList = [];
                        this.allDivisions.filter(g => this.divIds.includes(g.divisionId)).map(g => {
                            this.divisionList.push(g);
                        });
                    } else {
                        this.divisionList = result.data.divisions;
                    }
                }
            })
    
        }
        else if(type == "division"){
            this.filterDept = null;
            let obj = { 'divisionId': this.filterDivision };
            this.commonService.getDepartmentList(obj).subscribe((result) => {
                if (result.isSuccess) {
                    // this.departmentList = result.data.rows;
                    this.allDepartments = result.data.rows;
                    if (this.deptIds.length > 0 && this.roleId === 4) {
                        this.departmentList = [];
                        this.allDepartments.filter(g => this.deptIds.includes(g.departmentId)).map(g => {
                            this.departmentList.push(g);
                        });
                    } else {
                        this.departmentList = result.data.rows;
                    }
                    let query = "&divisionId="+this.filterDivision;
                    this.getcertificateTrend(query);
                    this.totalNoOfBadges(query);
                    this.topRatedCourses(query);
                    this.getCountDetails(resortId,query);
                    this.getcourseTrend(query);
                }
            })
        }
        else if(type == "dept"){
            let query = "&divisionId="+this.filterDivision+"&departmentId="+this.filterDept;
            this.getcertificateTrend(query);
            this.totalNoOfBadges(query);
            this.topRatedCourses(query);
            this.getCountDetails(resortId,query);
            this.getcourseTrend(query);
        }
      }

}
