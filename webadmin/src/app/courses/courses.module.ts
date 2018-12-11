import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoursesComponent } from './courses.component';
import {AuthGuard} from '../guard/auth.guard.component'
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { VideoFormComponent } from './addAndEdit/videoForm.component';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!




const routes: Routes = [
    { path: 'videos', component: CoursesComponent,canActivate : [AuthGuard]},
    { path: 'addVideo', component: VideoFormComponent,canActivate : [AuthGuard]},
    { path: 'editVideo', component: VideoFormComponent,canActivate : [AuthGuard]}
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        TagInputModule, 
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        SharedModule
    ],
    declarations: [
        CoursesComponent,VideoFormComponent
    ],
    bootstrap: [CoursesComponent]
})
export class CoursesModule { }
