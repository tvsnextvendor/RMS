import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {Router} from '@angular/router';
import {ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CalendarView } from 'angular-calendar';
import {BatchVar} from '../../Constants/batch.var';

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
 

   constructor(private headerService:HeaderService,private batchVar: BatchVar,private toastr:ToastrService,private router:Router){
    
   }

    ngOnInit(){
        this.headerService.setTitle({title:this.batchVar.calendarTitle, hidemodule: false});
    }

    goToBatch(event){
        localStorage.setItem('BatchStartDate',event);
        this.router.navigateByUrl('/addBatch');
      }
 
}
