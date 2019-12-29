import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { StepperControlComponent } from './stepper-control/stepper-control.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SeleccionadorDeMateriasComponent } from './seleccionador-de-materias/seleccionador-de-materias.component';
import { DemoMaterialModule } from './material-module';
import { BuscadorDeMateriasComponent } from './buscador-de-materias/buscador-de-materias.component';
import { HttpClientModule }    from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule, FormControl} from '@angular/forms';
import { SeleccionadorDeComisionesComponent } from './seleccionador-de-comisiones/seleccionador-de-comisiones.component';
import { DragComisionesComponent } from './drag-comisiones/drag-comisiones.component';
import { ComissionCardComponent } from './comission-card/comission-card.component';
import { SubjectTableComponent } from './subject-table/subject-table.component';

@NgModule({
  declarations: [
    AppComponent,
    StepperControlComponent,
    SeleccionadorDeMateriasComponent,
    BuscadorDeMateriasComponent,
    SeleccionadorDeComisionesComponent,
    DragComisionesComponent,
    ComissionCardComponent,
    SubjectTableComponent
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
