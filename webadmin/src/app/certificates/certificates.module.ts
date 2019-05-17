import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AuthGuard } from '../guard/auth.guard.component'
import { CertificatesComponent } from './certificates.component';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ModalModule } from 'ngx-bootstrap';
import { SanitizeHtmlPipe } from '../services/safeHtmlPipe';

const routes: Routes = [
  { path: 'certificates', component: CertificatesComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot(),
    FormsModule,
    CarouselModule,
    ModalModule.forRoot()
  ],
  declarations: [
    CertificatesComponent,
    SanitizeHtmlPipe
  ],
  bootstrap: [CertificatesComponent]
})
export class CertificatesModule { }
