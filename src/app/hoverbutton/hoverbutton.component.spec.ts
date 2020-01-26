import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverbuttonComponent } from './hoverbutton.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('HoverbuttonComponent', () => {
  let component: HoverbuttonComponent;
  let fixture: ComponentFixture<HoverbuttonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoverbuttonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoverbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

