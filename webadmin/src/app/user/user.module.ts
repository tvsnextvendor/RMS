import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { AuthGuard } from '../guard/auth.guard.component';
import { UserComponent } from './user.component';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DataTableModule } from "angular-6-datatable";
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ExcelService, PDFService } from '../services';
import { ModalModule } from 'ngx-bootstrap';
import {RolepermissionModule } from '../rolepermission/rolepermission.module';

const routes: Routes = [
  { path: 'users', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'users/:type', component: UserComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ModalModule.forRoot(),
    FormsModule,
    SelectDropDownModule,
    DataTableModule,
    RolepermissionModule,
    TabsModule,
    NgMultiSelectDropDownModule
  ],
  declarations: [
    UserComponent
  ],
  providers: [ExcelService, PDFService],
  bootstrap: [UserComponent]
})
export class UserModule { }
