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
import { TablaDeMateriasComponent } from './tabla-de-materias/tabla-de-materias.component';
import { BuscadorDeMateriasComponent } from './buscador-de-materias/buscador-de-materias.component';
import { HttpClientModule }    from '@angular/common/http';
import { HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import { InMemoryDataMateriasService } from './in-memory-data-materias.service';
import { FlexLayoutModule } from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule, FormControl} from '@angular/forms';
import { SeleccionadorDeComisionesComponent } from './seleccionador-de-comisiones/seleccionador-de-comisiones.component';
import { DragComisionesComponent } from './drag-comisiones/drag-comisiones.component';

@NgModule({
  declarations: [
    AppComponent,
    StepperControlComponent,
    SeleccionadorDeMateriasComponent,
    TablaDeMateriasComponent,
    BuscadorDeMateriasComponent,
    SeleccionadorDeComisionesComponent,
    DragComisionesComponent
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
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataMateriasService, {dataEncapsulation: false}
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }