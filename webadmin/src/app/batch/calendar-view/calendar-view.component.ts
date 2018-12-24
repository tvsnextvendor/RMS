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
   events: CalendarEvent[] = [
//    {  start : subDays(startOfDay(new Date()), 1),
//     end   : new Date(),
//     title : 'Batch 1' + ' ' + '4' + ' courses' ,
//     allDay: true },
//     {  start : subDays(startOfDay(new Date()), 1),
//         end   : new Date(),
//         title : 'Batch 2' + ' ' + '49' + ' courses' ,
//         allDay: true }
    ];

  
   constructor(private headerService:HeaderService,private http:HttpService,private batchVar: BatchVar,private toastr:ToastrService,private router:Router){
    this.batchVar.url = API_URL.URLS; 
   }

    ngOnInit(){
        this.headerService.setTitle({title:this.batchVar.calendarTitle, hidemodule: false});
        this.http.get(this.batchVar.url.getNewBatchList).subscribe(data=>{
            this.batchVar.batchList = data.batchDetails;
            this.batchVar.batchList.map(item => {
                let obj = {
                    start : subDays(startOfDay(new Date()), 1),
                    end   : addDays(new Date(), 1),
                    title : item.batchName + ' ' + item.courses + ' courses' ,
                    allDay: true
                }
               this.events.push(obj);    
            });
        });
       //console.log(this.events,"NGONINIT");
    }

    goToBatch(event){
        localStorage.setItem('BatchStartDate',event);
        this.router.navigateByUrl('/addBatch');
      }
 
}
