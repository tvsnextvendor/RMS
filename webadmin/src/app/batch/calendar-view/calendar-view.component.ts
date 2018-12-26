import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {Router} from '@angular/router';
import {ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import {BatchVar} from '../../Constants/batch.var';
import {startOfDay,endOfDay,subDays,addDays,endOfMonth,isSameDay,isSameMonth,addHours} from 'date-fns';
import {CalendarEvent,CalendarEventAction,CalendarEventTimesChangedEvent,CalendarView} from 'angular-calendar';
import { HttpService } from 'src/app/services/http.service';
import { API_URL } from '../../Constants/api_url';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-calendar-view',
    templateUrl: './calendar-view.component.html',
    styleUrls: ['./calendar-view.component.css']
})

export class CalendarViewComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
   events: CalendarEvent[] = [];

  
   constructor(private headerService:HeaderService,private datePipe:DatePipe,private http:HttpService,private batchVar: BatchVar,private toastr:ToastrService,private router:Router){
    this.batchVar.url = API_URL.URLS; 
   }

    ngOnInit(){
        this.headerService.setTitle({title:this.batchVar.calendarTitle, hidemodule: false});
        this.http.get(this.batchVar.url.getNewBatchList).subscribe(data=>{
            this.batchVar.batchList = data.batchDetails;
            let tempArray = [];
            this.batchVar.batchList.map(item => {
                const fromTime= this.datePipe.transform(item.fromDate, 'hh:mm a');
                const toTime= this.datePipe.transform(item.toDate, 'hh:mm a');
                let obj = {
                    start  : new Date(item.fromDate),
                    end    : new Date(item.toDate),
                    title  : item.batchName + ' Module - ' + item.moduleDetails.length + ' ' + item.courses + ' courses ' + fromTime +'-' + toTime ,
                    allDay : true
                }
                tempArray.push(obj);

            });
            this.events=tempArray;
            console.log(this.events);
        });
    }

    goToBatch(event){
        localStorage.setItem('BatchStartDate',event);
        this.router.navigateByUrl('/addBatch');
      }
 
}
