import { Component,Input,Output, EventEmitter, OnInit,ViewChild,ElementRef,TemplateRef} from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { HttpService,HeaderService,UtilService,AlertService,CommonService, CourseService,BreadCrumbService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import {AddQuizComponent} from '../add-quiz/add-quiz.component';
import { ModuleVar } from '../../Constants/module.var';
import { API_URL } from '../../Constants/api_url';
import { CommonLabels } from '../../Constants/common-labels.var'
import {QuizService} from '../quiz.service';

@Component({
    selector: 'app-upload-quiz',
    templateUrl: './upload-quiz.component.html',
    styleUrls: ['./upload-quiz.component.css'],
})

export class UploadQuizComponent implements OnInit {
    
quizList;
selectedQuizList=[];

   constructor(private breadCrumbService : BreadCrumbService,private quizService: QuizService,private modalService: BsModalService,private utilService : UtilService,private courseService : CourseService,private headerService:HeaderService,private elementRef:ElementRef,private toastr : ToastrService,public moduleVar: ModuleVar,private route: Router,private commonService: CommonService, private http: HttpService, private activatedRoute: ActivatedRoute,private alertService:AlertService,public commonLabels:CommonLabels){
     
   }

   ngOnInit(){
       this.getQuizList();
   }
   
     getQuizList(){
       let user = this.utilService.getUserData();
       this.courseService.getQuizList(user.userId).subscribe(res=>{
           if(res.isSuccess){
               this.quizList = res.data;
           }
       })
   }

   addQuiz(event,quiz, i){
   let type=event.target.checked;
    if(type){
      quiz['selected'] = true;
      let quest = quiz.Question;
      this.selectedQuizList.push(quest);
    }else{
      quiz['selected'] = false;
      let queId = quiz.Question.questionId;
      let index = this.selectedQuizList.findIndex(x => x.questionId === queId);
      this.selectedQuizList.splice(index,1);
    }
   }

   submitQuiz(){
       this.quizService.setQuiz(this.selectedQuizList);
      this.activatedRoute.queryParams.subscribe(params=>{ 
       if(params.tab == 'class'){
          this.route.navigate(['/cms-library'],{queryParams:{type : 'create',tab : 'class'}})
       }else if(params.tab == 'course'){
         this.route.navigate(['/cms-library'],{queryParams:{type : 'create',tab : 'course'}})
       }
     })
   }
   
}
