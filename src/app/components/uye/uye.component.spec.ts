/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UyeComponent } from './uye.component';

describe('UyeComponent', () => {
  let component: UyeComponent;
  let fixture: ComponentFixture<UyeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UyeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
