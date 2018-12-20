import { Component, OnInit } from '@angular/core';
import {DashboardVar} from '../../Constants/dashboard.var';
declare var require: any;
const Highcharts = require('highcharts');
import { HttpService } from '../../services/http.service';
import { API_URL } from 'src/app/Constants/api_url';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-charts',
  templateUrl: './employee-charts.component.html',
  styleUrls: ['./employee-charts.component.css'],
})

export class EmployeeChartsComponent implements OnInit {

     donutChartData = [];
     donutEnable = false;
     todayDate;
     
     constructor(private dashboardVar: DashboardVar, private http: HttpService, private route: Router) {
      this.dashboardVar.url=API_URL.URLS;
    }

  ngOnInit() {
    this.http.get(this.dashboardVar.url.getCourses).subscribe((data) => {
      this.dashboardVar.courses = data;
    });
    //get Module list
    this.http.get(this.dashboardVar.url.getModuleList).subscribe((data) => {
        this.dashboardVar.moduleList= data.ModuleList;
    });  
   //get Year List
    this.http.get(this.dashboardVar.url.getYearList).subscribe((data) => {
       // this.dashboardVar.yearList = data.Years;
       this.dashboardVar.yearList = [2018];
    })
    //get Course Trend list   
    this.http.get(this.dashboardVar.url.getCourseTrendChart).subscribe((data) => {
        this.dashboardVar.courseTrendData = data.CourseTrend;
    })


    this.getKeyStat();
    setTimeout(() => {       
      this.totalCoursesLine();
      this.videosTrendStackBar();
      this.employeeProgressPie();
      this.assignedCourses();
      this.completedCourses();
      this.topEmployees();
      this.totalNoOfBadges();
      this.certificationTrend();
    }, 1000);
  }


  getKeyStat() {
    this.http.get(this.dashboardVar.url.getKeyStat).subscribe((data) => {
        const keyStat= data;
        this.dashboardVar.newEmployee=keyStat.NewEmployees;
        this.dashboardVar.weekGrowth=keyStat.WeeklyGrowth;
        this.dashboardVar.recentComments=keyStat.RecentComments;

      });
  }

  onChangeModule(){
   //console.log(this.dashboardVar.moduleType);
  }

  onChangeYear(){
    //console.log(this.dashboardVar.years);
  }


  //Navigate to videos trend list page
  goToVideosTrend(){
    this.route.navigateByUrl('/videostrend');
  }

 //Navigate to employee status page
  goToEmpStatus(){
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
    labels: {enabled: false}
  },
  yAxis: {
    labels: {
           enabled: false
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
        fillColor : {
          linearGradient : [0, 0, 0, 300],
          stops : [
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
    labels: {enabled: false}
  },

  yAxis: {
    labels: {
           enabled: false
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
        fillColor : {
          linearGradient : [0, 0, 0, 300],
          stops : [
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
    labels: {enabled: false}
  },

  yAxis: {
    labels: {
           enabled: false
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
        fillColor : {
          linearGradient : [0, 0, 0, 300],
          stops : [
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



videosTrendStackBar() {
  Highcharts.chart('videosTrend', {
     credits: {
      enabled: false
  },
    chart: {
        type: 'column'
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
        categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    },
    yAxis: {
        min: 0,
        max: 100,
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
    series:    this.dashboardVar.courseTrendData
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
                categories: [
                    'Tokyo',
                    'New York',
                    'London',
                    'Berlin'
                ]
            },
    // title: {
    //     text: 'Browser market shares in January, 2018'
    // },
    // tooltip: {
    //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    // },
    plotOptions: {
        /*pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
        }*/
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },

    series: [{
        name: 'Brands',
        colorByPoint: true,
        data: [{
            name: 'Assigned',
            y: 70,
            sliced: true,
            selected: true
        }, {
            name: 'Completed',
            y: 20
        }, {
            name: 'In Progress',
            y: 10
        }]
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
        // scrollablePlotArea: {
        //     minWidth: 600,
        //     scrollPositionX: 1
        // }
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
     display: false
    },
    yAxis: {
       display: false
    },
legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'bottom'
    },
    series: [{
        name: 'Certified Employees',
        data: [
           5, 8, 7, 10, 13, 11, 14, 15
        ]
    }, {
        name: 'Uncertified Employees',
        data: [
           5, 4, 5, 6.5, 6, 8, 7.6, 6.5, 5
        ]
    }],
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

      const data = data_values.map(function(value, index) {
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
              x: 110,
              y: -10,
              floating: true,
              style: {
                color: '#468FB9',
                fontWeight: 'normal',
                fontSize: '10px'
            }
          },
          subtitle: {
            text: '100',
            verticalAlign: 'middle',
            align: 'left',
            x: 105,
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
        }
        );
    });
  }
  addQuickTasks(){
    this.todayDate = new Date();
    localStorage.setItem('BatchStartDate',this.todayDate);
    this.route.navigateByUrl('/addBatch');
  }
}
