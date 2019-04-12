import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalrequestsComponent } from './approvalrequests.component';

describe('ApprovalrequestsComponent', () => {
  let component: ApprovalrequestsComponent;
  let fixture: ComponentFixture<ApprovalrequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalrequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
