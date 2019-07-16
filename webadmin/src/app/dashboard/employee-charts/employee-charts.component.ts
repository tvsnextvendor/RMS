import { Component, OnInit } from '@angular/core';
import { DashboardVar } from '../../Constants/dashboard.var';
declare var require: any;
const Highcharts = require('highcharts');
import { HttpService, CommonService } from '../../services';
import { API_URL } from 'src/app/Constants/api_url';
import { Router } from '@angular/router';
import {UtilService} from '../../services/util.service';
import { CommonLabels } from '../../Constants/common-labels.var';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

@Component({
  selector: 'app-employee-charts',
  templateUrl: './employee-charts.component.html',
  styleUrls: ['./employee-charts.component.css'],
})

export class EmployeeChartsComponent implements OnInit {

  donutChartData = [];
  donutEnable = false;
  todayDate;
  viewEnable = false;
  viewText;
  topCourses;
  hideCharts = true;
  userRole;
  userId;

  TtlDivision;
  TtlDepartment;
  TtlEmployee;
  resortId;
  totalCourse;
  resortDetails = [];
  resortName;

  constructor(public dashboardVar: DashboardVar,
    private utilService: UtilService,
    private http: HttpService,
    private route: Router,
    public commonLabels: CommonLabels,
    private mScrollbarService: MalihuScrollbarService,
    private commonService: CommonService) {
    this.dashboardVar.url = API_URL.URLS;
    this.dashboardVar.userName = this.utilService.getUserData().username;
    this.hideCharts = this.utilService.getRole() === 2 ? false : true;
    this.resortId = this.utilService.getUserData().ResortUserMappings.length && this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
    this.resortName = this.utilService.getUserData().ResortUserMappings.length && this.utilService.getUserData().ResortUserMappings[0].Resort.resortName;
    this.userId =  this.utilService.getUserData().userId;
  }

  ngAfterViewInit() {
    this.mScrollbarService.initScrollbar('.sidebar-wrapper', { axis: 'y', theme: 'minimal-dark' });
  }

  ngOnInit() {
    this.viewText = "View more";
    this.userRole = this.utilService.getRole();
    this.getData();
    this.getTopResort();
    this.getKeyStat();
    this.dashboardVar.years = '2019';
    let query = this.resortId ? '?resortId='+this.resortId +'&type='+'summary': '';
  

    this.commonService.getTotalCourse(query).subscribe(result => {
      const totalCourses = result.data.training;
      this.dashboardVar.totalCoursesCount = result.data.courseTotalCount;
      this.dashboardVar.totalCourses = totalCourses.map(item => {
        return {name: item.status[0].toUpperCase() + item.status.substr(1).toLowerCase(), y: parseInt(item.totalcount, 10)};
      });
    });
    setTimeout(() => {
      this.totalCoursesLine();
      this.chartContainer();
      // this.totalStorageSpace();
      this.courseTrend();
      this.certificationTrend();
    }, 2000);
    this.commonService.getTotalCount(query).subscribe(result => {
      const data = result.data;
      this.TtlDivision = data.divisionCount;
      this.TtlDepartment = data.departmentCount;
      this.TtlEmployee = data.employeeCount;
    });
  }

  getData() {
    this.getcourseTrend();
    this.getcertificateTrend();
    this.topRatedCourses();
    this.totalNoOfBadges();
  }

  getTopResort(){
    let query = '?resortId=' + this.resortId + '&limit=5';
    this.commonService.getTopFiveResort(query).subscribe(resp=>{
      if(resp && resp.isSuccess){
        // console.log(resp)
        this.resortDetails = resp.data.rows.length ? resp.data.rows : [];
      }
    })
  }
  enableView() {
    this.viewEnable = !this.viewEnable;
    if (this.viewEnable) {
      this.viewText = "View less";
      this.getKeyStat();
      setTimeout(() => {
        if (this.hideCharts) {
          this.certificationTrend();
          this.courseTrend();
        }
        this.totalNoOfBadges();
        this.topEmployees();
        this.topRatedCourses();
      }, 1000);
    }
    else {
      this.viewText = "View more";
    }
  }

  topRatedCourses() {
    let query = this.resortId ? '?resortId='+this.resortId+'&type='+'summary' : '';
    
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
    let query =  '&resortId=' + this.resortId + '&createdBy=' + this.userId+'&type='+'summary';
    this.commonService.getCourseTrend(courseTrendObj,query).subscribe(result => {
      if (result && result.isSuccess) {
        this.dashboardVar.courseTrendData = result.data.map(item => parseInt(item, 10));
        setTimeout(()=>{
          this.courseTrend();
        },100) 
      }
    });
  }

  getcertificateTrend() {
    const certificationTrend = {
      year : this.dashboardVar.certYear
    };
    let query =  '&resortId=' + this.resortId + '&createdBy=' + this.userId+'&type='+'summary';
    this.commonService.getCertificateTrend(certificationTrend,query).subscribe(result => {
      if (result && result.isSuccess) {
        this.dashboardVar.certificationTrend = result.data.map(item => parseInt(item, 10));
        //setTimeout(()=>{
          this.certificationTrend();
        //},100) 
      }
    });
  }

  getKeyStat() {
    this.http.get(this.dashboardVar.url.getKeyStat).subscribe((data) => {
      const keyStat = data;
      this.dashboardVar.newEmployee = keyStat.NewEmployees;
      this.dashboardVar.weekGrowth = keyStat.WeeklyGrowth;
      this.dashboardVar.recentComments = keyStat.RecentComments;
    });
  }

  onChangeModule() {
    //console.log(this.dashboardVar.moduleType);
  }

  onChangeYear() {
    this.getcourseTrend() 
  }

  onChangeCertYear() {
    this.getcertificateTrend() 
  }


  //Navigate to videos trend list page
  goToVideosTrend() {
    this.route.navigateByUrl('/videostrend');
  }
  
  //Navigate to certification trend list page
  goTocertificationTrend(){
    this.route.navigateByUrl('/certification/trend');
  }

  //Navigate to employee status page
  goToEmpStatus() {
    this.route.navigateByUrl('/employeestatus');
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

  employeeProgressPie() {

    Highcharts.chart('employeeProgress', {
      credits: {
        enabled: false
      },
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle',
        x: 0,
        y: 0
      },
      title: {
        text: '',
        style: {
          display: 'none'
        }
      },
      subtitle: {
        text: '',
        style: {
          display: 'none'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          colors: ['#7DB5EC', '#90ED7C', '#F7A25C', '#CCCCCC'],
          dataLabels: {
            enabled: false,
          },
          showInLegend: true
        }
      },

      series: [{
        name: 'Brands',
        colorByPoint: true,
        data: this.dashboardVar.empProgress.data,
        dataLabels: {
          verticalAlign: 'top',
          enabled: true,
          color: '#ffffff',
          connectorWidth: 1,
          distance: -30,
          connectorColor: '#ffffff',
          formatter: function () {
            return (this.percentage > 0) ? Math.round(this.percentage) + '%' : '';
          }
        }
      }]
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
    series:  [{name:'Employees',data:this.dashboardVar.certificationTrend}],
    colors: ['#7DB5EC', '#CCCCCC'],
    // stroke:'grey',
  });
  }

  topEmployees() {
    this.http.get(this.dashboardVar.url.getTopEmployees).subscribe((data) => {
      this.dashboardVar.topEmployees = data.TopEmployees;
    });
  }

  // get total number of badges and display in chart
  totalNoOfBadges() {
    let query = this.resortId ? '?resortId='+this.resortId+'&type='+'summary' : '';
    this.commonService.getBadges(query).subscribe((resp) => {
      const donutChartData = resp.data.badges;
      this.dashboardVar.totalBadges = resp.data.totalCount;
      // let donutChartData = [
      //   {Badge : {badgeName : 'silver'},totalcount : '4'},
      //   {Badge : {badgeName : 'bronze'},totalcount : '4'},
      //   {Badge : {badgeName : 'gold'},totalcount : '4'},
      //   {Badge : {badgeName : 'platinum'},totalcount : '4'}]
      this.dashboardVar.totalNoOfBadges = donutChartData.map(item =>
          [item.Badge.badgeName , parseInt(item.totalcount, 10)]
      );
      // this.donutEnable = true;
      // console.log(donutChartData);
      // const labels = donutChartData.labels;
      // const data_values = donutChartData.data_values;

      // const data = data_values.map(function (value, index) {
      //   return { name: labels[index], y: value };
      // }, []);

      // Highcharts.chart('chartContainer', {
      //   chart: {
      //     plotBackgroundColor: null,
      //     plotBorderWidth: null,
      //     plotShadow: false,
      //     type: 'pie'
      //   },
      //   title: {
      //     text: 'Total',
      //     verticalAlign: 'middle',
      //     align: 'top',
      //     x: 120,
      //     y: -10,
      //     floating: true,
      //     style: {
      //       color: '#468FB9',
      //       fontWeight: 'normal',
      //       fontSize: '14px'
      //     }
      //   },
      //   subtitle: {
      //     text: '100',
      //     verticalAlign: 'middle',
      //     align: 'middle',
      //     x: 120,
      //     floating: true,
      //     style: {
      //       color: '#468FB9',
      //       fontWeight: 'normal',
      //       fontSize: '20px'
      //     }
      //   },
      //   tooltip: {
      //     pointFormat: '<b>{point.percentage:.1f}%</b>'
      //   },

      //   plotOptions: {
      //     pie: {
      //       colors: ['#B9F2FF', '#FFD700', '#C0C0C0', '#CD7F32'],
      //       allowPointSelect: true,
      //       innerSize: '60%',
      //       cursor: 'pointer',
      //       indexLabelFontSize: 12,
      //       dataLabels: {
      //         enabled: true,
      //         format: '{point.name}',
      //         connectorColor: 'black',
      //         style: {
      //           fontWeight: 'normal',
      //           fontSize: '8px',
      //         }
      //     },
      //       tooltip: {
      //           pointFormat: '<b>{point.percentage:.1f}%</b>'
      //       },

      //       plotOptions: {
      //           pie: {
      //               allowPointSelect: true,
      //               innerSize: '60%',
      //                cursor: 'pointer',
      //                indexLabelFontSize: 12,
      //                colors: ['#7DB5EC', '#CCCCCC', '#90ED7C', '#F7A25C'],
      //               dataLabels: {
      //                   enabled: true,
      //                   format: '{point.name}',
      //                 connectorColor: 'black',
      //                 style: {
      //                   fontWeight: 'normal',
      //                   fontSize: '8px',
      //               }
      //             }
      //           }
      //       },
      //       // xAxis: {
      //       //     categories: labels
      //       // },
      //       series: [{
      //           name: '',
      //           data: this.dashboardVar.totalNoOfBadges
      //       }],
      //       credits: {
      //         enabled: false
      //       }
      //     },
      //   },
      //   // xAxis: {
      //   //   categories: labels
      //   // },
      //   series: [{
      //     name: '',
      //     data: this.dashboardVar.totalNoOfBadges
      //   }],
      //   credits: {
      //     enabled: false
      //   }
      // }
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
}
