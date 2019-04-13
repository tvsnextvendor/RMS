import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-document-tab',
  templateUrl: './document-tab.component.html',
  styleUrls: ['./document-tab.component.css']
})
export class DocumentTabComponent implements OnInit {
  @Input() documentId;
  constructor() { }

  ngOnInit() {
    console.log(this.documentId);
  }

}
