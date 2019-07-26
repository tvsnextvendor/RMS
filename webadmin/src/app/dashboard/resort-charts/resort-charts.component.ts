import { Component, OnInit,Input } from '@angular/core';
import { DashboardVar } from '../../Constants/dashboard.var';
import { HttpService,CommonService,UtilService,CourseService } from '../../services';
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
    @Input() notificationCount;

    constructor(public dashboardVar: DashboardVar,
         private http: HttpService,
         private route: Router,
         public commonLabels:CommonLabels,
         private commonService : CommonService,
         private mScrollbarService: MalihuScrollbarService,
         private utilService :UtilService,
         private courseService :CourseService) {
        this.dashboardVar.url = API_URL.URLS;
    this.dashboardVar.userName = this.utilService.getUserData().username;
    this.hideCharts = this.utilService.getRole() === 2 ? false : true;
    this.resortId = this.utilService.getUserData().ResortUserMappings.length && this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
    this.resortName = this.utilService.getUserData().ResortUserMappings.length && this.utilService.getUserData().ResortUserMappings[0].Resort.resortName;
    this.userId = this.utilService.getUserData().userId;
    }

    ngAfterViewInit() {
      this.mScrollbarService.initScrollbar('.sidebar-wrapper', { axis: 'y', theme: 'minimal-dark' });
    }
    ngOnInit() {
        // this.getData();
        this.roleId = this.utilService.getRole();
        let userDetails = this.utilService.getUserData();
        this.userName = userDetails.userName;
        this.getKeyStat();
        this.getcertificateTrend();
        this.totalNoOfBadges();
        this.dashboardVar.years = '2019';
        this.dashboardVar.certYear = '2019';
        this.userRole = this.utilService.getRole();
        this.getCountDetails(this.resortId);
        if(this.roleId == 1){
          this.getResortDetails();
        }
        else{
          this.selectedParentResort = this.resortId;
          this.getChildResort('');
        }
    }

    getCountDetails(resortId){
        this.resortId = resortId;
        let query =  this.resortId ? '?resortId='+ this.resortId : '';
        this.commonService.getTotalCourse(query).subscribe(result => {
            const totalCourses = result.data.training;
            this.dashboardVar.totalCoursesCount = result.data.courseTotalCount;
            this.dashboardVar.totalCourses = totalCourses.map(item => {
              return {name: item.status[0].toUpperCase() + item.status.substr(1).toLowerCase(), y: parseInt(item.totalcount, 10)};
            });
          });
          // console.log(this.dashboardVar.totalCoursesCount,"this.dashboardVar.totalCoursesCount")
          setTimeout(() => {
            this.totalCoursesLine();
            this.chartContainer();
            this.totalStorageSpace();
          }, 2000);
          this.commonService.getTotalCount(query).subscribe(result => {
            const data = result.data;
            this.TtlDivision = data.divisionCount;
            this.TtlDepartment = data.departmentCount;
            this.TtlEmployee = data.employeeCount;
          });
        this.topRatedCourses();
        this.getcourseTrend();
    }
    selectResort(){
      this.resortId = (this.selectedResort)?this.selectedResort:this.selectedParentResort;
      this.getCountDetails(this.resortId);
    }

    getResortDetails(){
        let roleId = this.utilService.getRole();
        // Get All Parents N/W Admin
        let query = '?parents='+roleId;
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

    totalNoOfBadges() {
      let query = this.resortId ? '?resortId='+this.resortId : '';
      this.commonService.getBadges(query).subscribe((resp) => {
        // console.log(resp, 'daaaa');
        const donutChartData = resp.data.badges;
        this.dashboardVar.totalNoOfBadges = donutChartData.map(item =>
            [item.Badge.badgeName , parseInt(item.totalcount, 10)]
        );
        });
    }
    goToVideosTrend() {
      this.route.navigateByUrl('/videostrend');
    }

    //Navigate to certification trend list page
    goTocertificationTrend(){
      this.route.navigateByUrl('/certification/trend');
    }

   
  getcertificateTrend() {
    const certificationTrend = {
      year : this.dashboardVar.certYear
    };
    let query =  '&resortId=' + this.resortId + '&createdBy=' + this.userId;
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

    // badgesCertification() {
    //     this.http.get(this.dashboardVar.url.getBadgesAndCertification).subscribe((data) => {
    //         this.dashboardVar.badgesCertification = data;
    //         this.Badges = this.dashboardVar.badgesCertification.Badges;
    //         this.BadgesCertificate = this.dashboardVar.badgesCertification.Certification;
    //     });
    // }

    // visitorsLineChart() {
    //     Highcharts.chart('visitors', {
    //         credits: {
    //             enabled: false
    //         },
    //         chart: {
    //             type: 'area'
    //         },
    //         xAxis: {
    //             labels: { enabled: false }
    //         },
    //         yAxis: {
    //             labels: {
    //                 enabled: false
    //             },
    //             title: {
    //                 text: null
    //             },
    //             gridLineColor: 'transparent',
    //             min: 0,
    //             max: 10
    //         },
    //         title: {
    //             style: {
    //                 display: 'none'
    //             }
    //         },
    //         legend: {
    //             enabled: false,
    //         },
    //         plotOptions: {
    //             series: {
    //                 marker: {
    //                     enabled: true,
    //                     symbol: 'circle',
    //                     radius: 2,
    //                     fillColor: '#ffffff',
    //                     lineColor: '#000000',
    //                     lineWidth: 1

    //                 },
    //                 fillColor: {
    //                     linearGradient: [0, 0, 0, 300],
    //                     stops: [
    //                         [0, 'rgb(8,73,98)'],
    //                         [1, 'rgb(41,136,180)']
    //                     ]
    //                 }
    //             }
    //         },
    //         series: [{
    //             data: this.dashboardVar.visitorsData.data
    //         }]
    //     });
    // }

    // staffLineChart() {
    //     Highcharts.chart('staff', {
    //         credits: {
    //             enabled: false
    //         },
    //         chart: {
    //             type: 'area'
    //         },
    //         xAxis: {
    //             labels: { enabled: false }
    //         },
    //         yAxis: {
    //             labels: {
    //                 enabled: false
    //             },
    //             title: {
    //                 text: null
    //             },
    //             gridLineColor: 'transparent',
    //             min: 0,
    //             max: 10
    //         },
    //         title: {
    //             style: {
    //                 display: 'none'
    //             }
    //         },
    //         legend: {
    //             enabled: false,
    //         },
    //         plotOptions: {
    //             series: {
    //                 marker: {
    //                     enabled: true,
    //                     symbol: 'circle',
    //                     radius: 2,
    //                     fillColor: '#ffffff',
    //                     lineColor: '#000000',
    //                     lineWidth: 1

    //                 },
    //                 fillColor: {
    //                     linearGradient: [0, 0, 0, 300],
    //                     stops: [
    //                         [0, 'rgb(8,73,98)'],
    //                         [1, 'rgb(41,136,180)']
    //                     ]
    //                 }
    //             }
    //         },
    //         series: [{
    //             data: this.dashboardVar.staffData.data
    //         }]
    //     });
    // }

    // totalEmployeeLineChart() {
    //     Highcharts.chart('totalemployee', {
    //         credits: {
    //             enabled: false
    //         },
    //         chart: {
    //             type: 'area'
    //         },
    //         title: {
    //             style: {
    //                 display: 'none'
    //             }
    //         },
    //         legend: {
    //             enabled: false,
    //         },
    //         xAxis: {
    //             labels: { enabled: false }
    //         },
    //         yAxis: {
    //             labels: {
    //                 enabled: false
    //             },
    //             title: {
    //                 text: null
    //             },
    //             gridLineColor: 'transparent',
    //             min: 0,
    //             max: 10
    //         },
    //         plotOptions: {
    //             series: {
    //                 fillColor: {
    //                     linearGradient: [0, 0, 0, 300],
    //                     stops: [
    //                         [0, 'rgb(8,73,98)'],
    //                         [1, 'rgb(41,136,180)']
    //                     ]
    //                 }
    //             }
    //         },
    //         series: [{
    //             data: [0, 2, 1.3, 3, 2.3, 3.3, 0.8, 1.7, 1, 0]
    //         }]
    //     });
    // }

    // feedbackrating() {
    //     const canvas: any = document.getElementById('rating');
    //     const ctx = canvas.getContext('2d');
    //     const options = {
    //         legend: {
    //             display: false,
    //         },
    //         scales: {
    //             yAxes: [{
    //                 gridLines: {
    //                     drawBorder: false,
    //                 },
    //             }],
    //             xAxes: [{
    //                 display: false,
    //                 gridLines: {
    //                     display: false,
    //                 },
    //             }]
    //         }
    //     }
    //     const horizontalBarChartData = {
    //         labels: ['5', '4', '3', '2', '1'],
    //         datasets: [{
    //             backgroundColor: ['#9FC05A', '#ADD633', '#F6D834', '#F3B335', '#F18C5A'],
    //             data: this.dashboardVar.feedbackData.data
    //         }],
    //     };

    //     const myBarChart = new Chart(ctx, {
    //         type: 'horizontalBar',
    //         data: horizontalBarChartData,
    //         options: options

    //     });
    // }

    // taskStackbar() {
    //     Highcharts.chart('task', {
    //         credits: {
    //             enabled: false
    //         },
    //         chart: {
    //             type: 'column'
    //         },

    //         title: {
    //             text: '',
    //             style: {
    //                 display: 'none'
    //             }
    //         },
    //         xAxis: {
    //             categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN']
    //         },
    //         yAxis: {
    //             min: 0,
    //             max: 100,
    //             title: {
    //                 text: null
    //             },
    //             stackLabels: {
    //                 enabled: true,
    //                 style: {
    //                     fontWeight: 'bold',
    //                     color: 'gray'
    //                 }
    //             }
    //         },

    //         // legend: {
    //         //     align: 'left',
    //         //layout: 'horizontal',
    //         //verticalAlign: 'bottom',
    //         // x: 100,
    //         // y: 0,
    //         //  backgroundColor: 'white',
    //         //  borderColor: '#CCC',
    //         // borderWidth: 1,
    //         // shadow: false
    //         //},
    //         // legend: {
    //         //     align: 'right',
    //         //     x: -30,
    //         //     verticalAlign: 'top',
    //         //     y: 25,
    //         //     floating: true,
    //         //     backgroundColor: 'white',
    //         //     borderColor: '#CCC',
    //         //     borderWidth: 1,
    //         //     shadow: false
    //         // },
    //         plotOptions: {
    //             column: {
    //                 stacking: 'normal',
    //                 dataLabels: {
    //                     enabled: false,
    //                 },
    //                 showInLegend: true,
    //                 allowPointSelect: true,
    //                 cursor: 'pointer',
    //             }
    //         },
    //         series: this.dashboardVar.taskChart,

    //         colors: ['#CCCCCC', '#468FB9'],
    //     });
    // }

    // visitorsByResortPie() {
    //     Highcharts.chart('visitorsByResort', {
    //         credits: {
    //             enabled: false
    //         },
    //         chart: {
    //             plotBackgroundColor: null,
    //             plotBorderWidth: null,
    //             plotShadow: false,
    //             type: 'pie'
    //         },
    //         title: {
    //             text: '',
    //             style: {
    //                 display: 'none'
    //             }
    //         },
    //         plotOptions: {
    //             pie: {
    //                 size: '60%',
    //                 cursor: 'pointer',
    //                 colors: ['#7DB5EC', '#CCCCCC', '#90ED7C', '#F7A25C'],
    //             }
    //         },
    //         series: [{
    //             data: this.dashboardVar.visitorsResort,
    //             type: 'pie',
    //             name: 'Percentage',
    //             dataLabels: {
    //                 verticalAlign: 'top',
    //                 enabled: true,
    //                 color: '#ffffff',
    //                 connectorWidth: 1,
    //                 distance: -30,
    //                 connectorColor: '#ffffff',
    //                 formatter: function () {
    //                     return Math.round(this.percentage) + '%';
    //                 }
    //             }
    //         }, {
    //             data: this.dashboardVar.visitorsResort,
    //             type: 'pie',
    //             name: 'Percentage',
    //             dataLabels: {
    //                 enabled: true,
    //                 color: '#000000',
    //                 connectorWidth: 1,
    //                 distance: 30,
    //                 connectorColor: '#000000',
    //                 formatter: function () {
    //                     return '<b>' + this.point.name + '</b>:<br/> ' + Math.round(this.percentage) + '%';
    //                 }
    //             }
    //         }]
    //     });
    // }

    // reservationByResort() {
    //     this.http.get(this.dashboardVar.url.getReservationByResort).subscribe((resp) => {
    //         const donutChartData = resp.ReservationByResort;
    //         this.donutEnable = true;
    //         const labels = donutChartData.labels;
    //         const data_values = donutChartData.data_values;

    //         const data = data_values.map(function (value, index) {
    //             return { name: labels[index], y: value };
    //         }, []);

    //         Highcharts.chart('chartContainer', {
    //             chart: {
    //                 plotBackgroundColor: null,
    //                 plotBorderWidth: null,
    //                 plotShadow: false,
    //                 type: 'pie'
    //             },
    //             title: {
    //                 text: '',
    //             },
    //             tooltip: {
    //                 pointFormat: '<b>{point.percentage:.1f}%</b>'
    //             },

    //             plotOptions: {
    //                 pie: {
    //                     allowPointSelect: true,
    //                     innerSize: '60%',
    //                     cursor: 'pointer',
    //                     indexLabelFontSize: 12,
    //                     colors: ['#7DB5EC', '#CCCCCC', '#90ED7C', '#F7A25C'],
    //                     dataLabels: {
    //                         enabled: true,
    //                         format: '{point.name}',
    //                         connectorColor: 'black',
    //                         style: {
    //                             fontWeight: 'normal',
    //                             fontSize: '10px',
    //                         }
    //                     }
    //                 }
    //             },
    //             xAxis: {
    //                 categories: labels
    //             },
    //             series: [{
    //                 name: '',
    //                 data: data
    //             }],
    //             credits: {
    //                 enabled: false
    //             }
    //         }
    //         );
    //     });
    // }
    addQuickTasks() {
        this.todayDate = new Date();
        localStorage.setItem('BatchStartDate', this.todayDate);
        this.route.navigateByUrl('/addBatch');
    }
    onChangeYear(){
      // console.log(this.dashboardVar.years)
      this.getcourseTrend()
    }

    topRatedCourses() {
      let query = this.resortId ? '?resortId='+this.resortId : '';
        this.commonService.getTopRatedTrainingClasses(query).subscribe((result) => {
          if (result && result.isSuccess) {
            this.topCourses = result.data.map(item => {
              return {id: item.trainingClassId, courseName: item.trainingClassName, rating: item.ratingStar};
            });
          }
        });
      }
    
      getcourseTrend() {
        const courseTrendObj = {
          year : this.dashboardVar.years
        };
        let query = this.resortId ? '&resortId='+this.resortId : '';
        this.commonService.getCourseTrend(courseTrendObj,query).subscribe(result => {
          if (result && result.isSuccess) {
            this.dashboardVar.courseTrendData = result.data.map(item => parseInt(item, 10));
            // console.log(this.dashboardVar.courseTrendData, 'data');
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
                  '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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

}
