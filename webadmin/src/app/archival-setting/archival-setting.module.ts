import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AuthGuard } from '../guard/auth.guard.component';
import { ArchivalSettingComponent } from './archival-setting.component';
import { AddArchivalSettingComponent } from './add-archival/add-archival.component';

const routes: Routes = [
  { path: 'archivalsetting', component: ArchivalSettingComponent, canActivate: [AuthGuard] },
  { path: 'add', component: AddArchivalSettingComponent, canActivate: [AuthGuard] }
];
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    NgxPaginationModule
  ],
  declarations: [
    ArchivalSettingComponent,
    AddArchivalSettingComponent
  ],
})
export class ArchivalSettingModule { }
