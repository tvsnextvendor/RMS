import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalrequestsdetailsComponent } from './approvalrequestsdetails.component';

describe('ApprovalrequestsdetailsComponent', () => {
  let component: ApprovalrequestsdetailsComponent;
  let fixture: ComponentFixture<ApprovalrequestsdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalrequestsdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalrequestsdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
