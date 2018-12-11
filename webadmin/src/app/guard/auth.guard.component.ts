import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {
    showSidebar = false;
    showHeader = false;
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('userData')) {
        this.showSidebar = true;
        this.showHeader = true;
        return true;
    }

    this.router.navigate(['/login']);
    this.showSidebar = false;
    this.showHeader = false;
    return false;
  }
}
