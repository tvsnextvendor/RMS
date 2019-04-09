import { Component, OnInit,TemplateRef} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {Router} from '@angular/router';
import {ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
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
  activeDayIsOpen : boolean;
  events: CalendarEvent[] = [];

  
   constructor(private headerService:HeaderService,private datePipe:DatePipe,private http:HttpService,public batchVar: BatchVar,private toastr:ToastrService,private router:Router,private modalService:BsModalService){
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
                    start       : new Date(item.fromDate),
                    end         : new Date(item.toDate),
                    batchName   : item.batchName,
                    moduleCount : item.moduleDetails.length,
                    courseCount : item.courses,
                    timings     : fromTime +'-' + toTime ,
                    id          : item.batchId, 
                }
                tempArray.push(obj);
            });
            this.events=tempArray;
        });
    }

    goToBatch(event,addBatch){

        
        localStorage.setItem('BatchStartDate',event);
        // this.router.navigateByUrl('/addBatch');
        this.openEditModal(addBatch,event)
      }

    openEditModal(template: TemplateRef<any>, forum) {
        let modalConfig={
            class : "modal-xl"
          }

        this.batchVar.modalRef = this.modalService.show(template,modalConfig);
    }
 
}
