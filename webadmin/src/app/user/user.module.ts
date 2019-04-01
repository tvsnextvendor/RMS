import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { AuthGuard } from '../guard/auth.guard.component';
import { UserComponent } from './user.component';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from "angular-6-datatable";
import { ExcelService } from '../services/excel.service';
import { PDFService } from '../services/pdf.service';
import { ModalModule } from 'ngx-bootstrap';

const routes: Routes = [
  { path: 'users', component: UserComponent, canActivate: [AuthGuard] },
];
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ModalModule.forRoot(),
    FormsModule,
    SelectDropDownModule,
    DataTableModule
  ],
  declarations: [
    UserComponent
  ],
  providers: [ExcelService, PDFService],
  bootstrap: [UserComponent]
})
export class UserModule { }
