import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { StepperControlComponent } from './stepper-control/stepper-control.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SubjectSelectorComponent } from './subject-selector/subject-selector.component';
import { DemoMaterialModule } from './material-module';
import { SubjectSearchComponent } from './subject-search/subject-search.component';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule, FormControl} from '@angular/forms';
import { CommissionSelectorComponent } from './commission-selector/commission-selector.component';
import { DragCommissionsComponent } from './drag-commissions/drag-commissions.component';
import { ComissionCardComponent } from './comission-card/comission-card.component';
import { SubjectTableComponent } from './subject-table/subject-table.component';
import { CheckboxItemComponent } from './checkbox-item/checkbox-item.component';
import { ConfigurationsComponent } from './configurations/configurations.component';

@NgModule({
  declarations: [
    AppComponent,
    StepperControlComponent,
    SubjectSelectorComponent,
    SubjectSearchComponent,
    CommissionSelectorComponent,
    DragCommissionsComponent,
    ComissionCardComponent,
    SubjectTableComponent,
    CheckboxItemComponent,
    ConfigurationsComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatToolbarModule,
    DemoMaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
