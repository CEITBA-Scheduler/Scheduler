import { RouterModule } from '@angular/router';
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

import { TestingModule1Component } from './testing-module1/testing-module1.component';
import { TestingModule2Component } from './testing-module2/testing-module2.component';
import { TestingModule3Component } from './testing-module3/testing-module3.component';
import { CombinerComponent } from './combiner/combiner.component';
import { LoginComponent } from './login/login.component';

import { firebaseConfig } from './secrets';
//import { AngularFireModule } from '@angular/fire';
//import { AngularFirestoreModule } from '@angular/fire/firestore';
//import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { MatIconModule, MatButtonModule } from '@angular/material';

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
    ConfigurationsComponent,
    TestingModule1Component,
    TestingModule2Component,
    TestingModule3Component,
    CombinerComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'combinadorDeHorarios', pathMatch: 'full'},
      { path: 'combinadorDeHorarios', component: CombinerComponent},
      { path: 'login', component: LoginComponent },
      { path: 'testingModule1', component: TestingModule1Component },
      { path: 'testingModule2', component: TestingModule2Component },
      { path: 'testingModule3', component: TestingModule3Component }
    ]),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatToolbarModule,
    MatButtonModule,
    DemoMaterialModule,
    HttpClientModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
