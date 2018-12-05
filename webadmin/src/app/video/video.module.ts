import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { VideoComponent } from './video.component';
import {AuthGuard} from '../guard/auth.guard.component'
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { VideoFormComponent } from './addAndEdit/videoForm.component';
import { ModalModule } from 'ngx-bootstrap';


const routes: Routes = [
    { path: 'videos', component: VideoComponent,canActivate : [AuthGuard]},
    { path: 'videoForm', component: VideoFormComponent,canActivate : [AuthGuard]}
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        FormsModule,
        NgbModule,
        ModalModule.forRoot(),
        SharedModule
    ],
    declarations: [
        VideoComponent,VideoFormComponent
    ],
    bootstrap: [VideoComponent]
})
export class VideoModule { }
