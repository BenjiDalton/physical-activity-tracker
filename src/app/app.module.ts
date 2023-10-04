import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ToolbarComponent } from './core/toolbar/toolbar.component';
import { ModalComponent } from './core/modal/modal.component';
import { CalendarComponent } from './core/calendar/calendar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StepperComponent } from './core/stepper/stepper.component';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
	declarations: [
		AppComponent,
		ToolbarComponent,
		ModalComponent,
  		CalendarComponent,
    	StepperComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		MatDatepickerModule,
		BrowserAnimationsModule,
		MatFormFieldModule,
		MatDatepickerModule,
		FormsModule,
		ReactiveFormsModule,
		MatNativeDateModule,
		MatInputModule,
		MatStepperModule,
		MatButtonModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
