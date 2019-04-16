import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFileComponent } from './content-file.component';

describe('ContentFileComponent', () => {
  let component: ContentFileComponent;
  let fixture: ComponentFixture<ContentFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
