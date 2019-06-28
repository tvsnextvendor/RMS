import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AuthGuard } from '../guard/auth.guard.component'
import { CertificatesComponent } from './certificates.component';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ModalModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module'

const routes: Routes = [
  { path: 'certificates', component: CertificatesComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot(),
    FormsModule,
    SharedModule,
    CarouselModule,
    ModalModule.forRoot()
  ],
  declarations: [
    CertificatesComponent,
  ],
  bootstrap: [CertificatesComponent]
})
export class CertificatesModule { }
