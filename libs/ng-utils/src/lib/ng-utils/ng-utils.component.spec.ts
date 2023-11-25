import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgUtilsComponent } from './ng-utils.component';

describe('NgUtilsComponent', () => {
  let component: NgUtilsComponent;
  let fixture: ComponentFixture<NgUtilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgUtilsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
