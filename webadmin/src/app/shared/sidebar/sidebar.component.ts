import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SideBarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
