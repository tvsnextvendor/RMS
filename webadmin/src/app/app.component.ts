import { Component } from '@angular/core';
import {AuthGuard} from './guard/auth.guard.component'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'tvs-next';
  constructor(public authGuard : AuthGuard){}
}
