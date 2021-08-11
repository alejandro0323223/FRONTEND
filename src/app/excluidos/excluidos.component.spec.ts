import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcluidosComponent } from './excluidos.component';

describe('ExcluidosComponent', () => {
  let component: ExcluidosComponent;
  let fixture: ComponentFixture<ExcluidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcluidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcluidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
