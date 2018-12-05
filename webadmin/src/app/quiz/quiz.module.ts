import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { QuizComponent } from './quiz.component';
import {AddQuizComponent} from './add-quiz/add-quiz.component';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard.component'


const routes: Routes = [
    { path: 'quiz', component: QuizComponent ,canActivate : [AuthGuard]},
    { path: 'addquiz', component: AddQuizComponent,canActivate : [AuthGuard] }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ],
  declarations: [
    QuizComponent,AddQuizComponent
  ],
  bootstrap: [QuizComponent]
})
export class QuizModule { }
