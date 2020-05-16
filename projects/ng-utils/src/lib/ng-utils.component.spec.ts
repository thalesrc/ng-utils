import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgUtilsComponent } from './ng-utils.component';

describe('NgUtilsComponent', () => {
  let component: NgUtilsComponent;
  let fixture: ComponentFixture<NgUtilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgUtilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
