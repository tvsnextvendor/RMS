import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonLabels } from '../Constants/common-labels.var';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private commonLabels: CommonLabels,
        private authService: AuthService,
        private alertService: AlertService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log(err, 'errror');
            if ((err.status === 403 && err.statusText === this.commonLabels.msgs.tokenExpStatusText &&
                err.error && err.error.message === this.commonLabels.msgs.tokenExpErrorMsg) ) {
                // auto logout if 401 response returned from api
                this.authService.logOut();
            //     // location.reload(true);
                this.router.navigateByUrl('/login');
                this.alertService.error(err.error.message);
            }

            const error = err || err.statusText;
            return throwError(error);
        }));
    }

}
