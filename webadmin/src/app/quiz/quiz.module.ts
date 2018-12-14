import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import { QuizComponent } from './quiz.component';
import {AddQuizComponent} from './add-quiz/add-quiz.component';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard.component'


const routes: Routes = [
    { path: 'quiz', component: QuizComponent ,canActivate : [AuthGuard]},
    { path: 'quizdetails/:id/:videoId', component: AddQuizComponent,canActivate : [AuthGuard] },
    { path: 'quiz/add', component: AddQuizComponent,canActivate : [AuthGuard] }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot()
    ],
  declarations: [
    QuizComponent,AddQuizComponent
  ],
  bootstrap: [QuizComponent]
})
export class QuizModule { }
