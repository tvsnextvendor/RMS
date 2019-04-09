import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMSLibraryComponent } from './cms-library.component';

describe('CMSLibraryComponent', () => {
  let component: CMSLibraryComponent;
  let fixture: ComponentFixture<CMSLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CMSLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
