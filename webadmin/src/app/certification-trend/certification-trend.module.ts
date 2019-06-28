import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AuthGuard } from '../guard/auth.guard.component';
import { CertificationTrendComponent } from './certification-trend.component';
import { DataTableModule } from "angular-6-datatable";
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module'

const routes: Routes = [
    { path: 'certification/trend', component: CertificationTrendComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        NgHttpLoaderModule.forRoot(),
        DataTableModule,
        FormsModule,
        SharedModule
    ],
    declarations: [
        CertificationTrendComponent
    ],
    bootstrap: [CertificationTrendComponent],
    
})
export class CertificationTrendModule { }
