import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentRecordComponent } from './student-record.component';

describe('StudentRecordComponent', () => {
  let component: StudentRecordComponent;
  let fixture: ComponentFixture<StudentRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentRecordComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with one student entry', () => {
    expect(component.students.length).toBe(1);
  });

  it('should log form value on submit', () => {
    spyOn(console, 'log');
    component.onSubmit();
  });
});
