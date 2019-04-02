import { Component, OnInit } from '@angular/core';
import { DashboardVar } from '../../Constants/dashboard.var';
declare var require: any;
const Highcharts = require('highcharts');
import { HttpService } from '../../services/http.service';
import { API_URL } from 'src/app/Constants/api_url';
import { Router } from '@angular/router';
import {UtilService} from '../../services/util.service';

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

  constructor(public dashboardVar: DashboardVar,private utilService:UtilService ,private http: HttpService, private route: Router) {
    this.dashboardVar.url = API_URL.URLS;
    this.dashboardVar.userName = this.utilService.getUserData().username
    this.hideCharts = this.utilService.getRole() == 2 ? false : true;
  }

  ngOnInit() {
    this.viewText = "View more";
    this.getData();
    this.getKeyStat();

    setTimeout(() => {
      this.totalCoursesLine();
      this.employeeProgressPie();
      this.assignedCourses();
      this.completedCourses();
      this.inProgress();
    }, 2000);
  }

  getData() {
    this.http.get(this.dashboardVar.url.getCourses).subscribe((data) => {
      this.dashboardVar.courses = data;
    });
    //get Module list
    this.http.get(this.dashboardVar.url.getProgramList).subscribe((data) => {
      this.dashboardVar.moduleList = data.programList;
    });
    //get Year List
    this.http.get(this.dashboardVar.url.getYearList).subscribe((data) => {
      // this.dashboardVar.yearList = data.Years;
      this.dashboardVar.yearList = [2018];
    })

    //get Course Trend list   
    this.http.get(this.dashboardVar.url.getCourseTrendChart).subscribe((data) => {
      this.dashboardVar.courseTrendData = data;
    })

    this.http.get(this.dashboardVar.url.getEmployeeProgress).subscribe((data) => {
      this.dashboardVar.empProgress = data;
    });

    this.http.get(this.dashboardVar.url.getCertificationTrend).subscribe((data) => {
      this.dashboardVar.certificationTrend = data;
    });
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
    this.http.get(this.dashboardVar.url.getTopCourses).subscribe((data) => {
      this.topCourses = data.TopCourses;
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
    //console.log(this.dashboardVar.years);
  }


  //Navigate to videos trend list page
  goToVideosTrend() {
    this.route.navigateByUrl('/videostrend');
  }

  //Navigate to employee status page
  goToEmpStatus() {
    this.route.navigateByUrl('/employeestatus');
  }

  totalCoursesLine() {
    Highcharts.chart('totalCourses', {
      credits: {
        enabled: false
      },
      chart: {
        type: 'area'
      },
      title: {
        style: {
          display: 'none'
        }
      },
      xAxis: {
        labels: { enabled: false }
      },
      yAxis: {
        labels: {
          enabled: false
        },
        title: {
          text: null
        },
        gridLineColor: 'transparent',
        min: 0,
        max: 10
      },
      legend: {
        enabled: false,
      },

      plotOptions: {
        series: {
          marker: {
            enabled: true,
            symbol: 'circle',
            radius: 2,
            fillColor: '#ffffff',
            lineColor: '#000000',
            lineWidth: 1
          },
          fillColor: {
            linearGradient: [0, 0, 0, 300],
            stops: [
              [0, 'rgb(29,74,97)'],
              [1, 'rgb(67,138,179)']
            ]
          }
        }
      },
      series: [{
        data: this.dashboardVar.courses.TotalCourses.data
      }]

    });

  }



  assignedCourses() {

    Highcharts.chart('assignedCourses', {
      credits: {
        enabled: false
      },
      chart: {
        type: 'area'
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
      xAxis: {
        labels: { enabled: false }
      },

      yAxis: {
        labels: {
          enabled: false
        },
        title: {
          text: null
        },
        gridLineColor: 'transparent',
        min: 0,
        max: 10
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          marker: {
            enabled: true,
            symbol: 'circle',
            radius: 2,
            fillColor: '#ffffff',
            lineColor: '#000000',
            lineWidth: 1

          },
          fillColor: {
            linearGradient: [0, 0, 0, 300],
            stops: [
              [0, 'rgb(8,73,98)'],
              [1, 'rgb(41,136,180)']
            ]
          }
        }
      },

      series: [{
        // data: [0, 7.0, 5, 9, 8.3, 9.3, 6.8, 7.7, 6, 0]
        data: this.dashboardVar.courses.AssignedCourses.data
      }]
    });

  }


  completedCourses() {

    Highcharts.chart('completedCourses', {
      credits: {
        enabled: false
      },
      chart: {
        type: 'area'
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
      xAxis: {
        labels: { enabled: false }
      },

      yAxis: {
        labels: {
          enabled: false
        },
        title: {
          text: null
        },
        gridLineColor: 'transparent',
        min: 0,
        max: 10
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          marker: {
            enabled: true,
            symbol: 'circle',
            radius: 2,
            fillColor: '#ffffff',
            lineColor: '#000000',
            lineWidth: 1

          },
          fillColor: {
            linearGradient: [0, 0, 0, 300],
            stops: [
              [0, 'rgb(8,73,98)'],
              [1, 'rgb(41,136,180)']
            ]
          }
        }
      },

      series: [{
        data: this.dashboardVar.courses.CompletedCourses.data
      }]
    });

  }

  inProgress() {
    Highcharts.chart('inProgress', {
      credits: {
        enabled: false
      },
      chart: {
        type: 'area'
      },
      title: {
        text: '',
        style: {
          display: 'none'
        }
      },
      xAxis: {
        labels: { enabled: false }
      },

      yAxis: {
        labels: {
          enabled: false
        },
        title: {
          text: null
        },
        gridLineColor: 'transparent',
        min: 0,
        max: 10
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          marker: {
            enabled: true,
            symbol: 'circle',
            radius: 2,
            fillColor: '#ffffff',
            lineColor: '#000000',
            lineWidth: 1

          },
          fillColor: {
            linearGradient: [0, 0, 0, 300],
            stops: [
              [0, 'rgb(8,73,98)'],
              [1, 'rgb(41,136,180)']
            ]
          }
        }
      },

      series: [{
        data: this.dashboardVar.courses.InProgressCourses.data
      }]
    });

  }


  courseTrend() {
    Highcharts.chart('videosTrend', {
      credits: {
        enabled: false
      },
      chart: {
        type: 'column'
      },
      title: {
        text: 'null',
        style: {
          display: 'none'
        }
      },
      xAxis: {
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      },
      yAxis: {
        min: 0,
        max: 50,
        title: {
          text: null
        },
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        stackLabels: {
          enabled: false,
          style: {
            fontWeight: 'bold',
            color: 'gray'
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
            color: 'red'
          }
        }
      },
      series: this.dashboardVar.courseTrendData.CourseTrend
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
        display: false
      },
      yAxis: {
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
    series:   this.dashboardVar.certificationTrend.data,
    colors:['#7DB5EC','#CCCCCC'],
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

    this.http.get(this.dashboardVar.url.getTotalNoOfBadges).subscribe((resp) => {
      const donutChartData = resp.NoOfBadgesDonut;
      this.donutEnable = true;
      // console.log(donutChartData);
      const labels = donutChartData.labels;
      const data_values = donutChartData.data_values;

      const data = data_values.map(function (value, index) {
        return { name: labels[index], y: value };
      }, []);

      Highcharts.chart('chartContainer', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Total',
          verticalAlign: 'middle',
          align: 'top',
          x: 120,
          y: -10,
          floating: true,
          style: {
            color: '#468FB9',
            fontWeight: 'normal',
            fontSize: '14px'
          }
        },
        subtitle: {
          text: '100',
          verticalAlign: 'middle',
          align: 'middle',
          x: 120,
          floating: true,
          style: {
            color: '#468FB9',
            fontWeight: 'normal',
            fontSize: '20px'
          }
        },
        tooltip: {
          pointFormat: '<b>{point.percentage:.1f}%</b>'
        },

        plotOptions: {
          pie: {
            colors: ['#B9F2FF', '#FFD700', '#C0C0C0', '#CD7F32'],
            allowPointSelect: true,
            innerSize: '60%',
            cursor: 'pointer',
            indexLabelFontSize: 12,
            dataLabels: {
              enabled: true,
              format: '{point.name}',
              connectorColor: 'black',
              style: {
                fontWeight: 'normal',
                fontSize: '8px',
              }
          },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },

            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    innerSize: '60%',
                     cursor: 'pointer',
                     indexLabelFontSize: 12,
                     colors:['#7DB5EC','#CCCCCC','#90ED7C','#F7A25C'],
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',
                      connectorColor: 'black',
                      style: {
                        fontWeight: 'normal',
                        fontSize: '8px',
                    }
                  }
                }
            },
            xAxis: {
                categories: labels
            },
            series: [{
                name: '',
                data: data
            }],
            credits: {
              enabled: false
            }
          },
        },
        xAxis: {
          categories: labels
        },
        series: [{
          name: '',
          data: data
        }],
        credits: {
          enabled: false
        }
      }
      );
    });
  }
  addQuickTasks() {
    this.todayDate = new Date();
    localStorage.setItem('BatchStartDate', this.todayDate);
    this.route.navigateByUrl('/addBatch');
  }
}
