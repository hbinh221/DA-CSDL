import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerModuleRoutingModule } from './customer-module-routing.module';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { BookingFlightComponent } from './booking-flight/booking-flight.component';
import { PersonalFlightComponent } from './personal-flight/personal-flight.component';
import { SearchFlightComponent } from './search-flight/search-flight.component';
import { RegisterComponent } from './register/register.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FlightSelectionComponent } from './flight-selection/flight-selection.component';
import { FlightSelectionDetailComponent } from './flight-selection/partials/flight-selection-detail/flight-selection-detail.component';


@NgModule({
  declarations: [
    CustomerLayoutComponent,
    BookingFlightComponent,
    SearchFlightComponent,
    PersonalFlightComponent,
    RegisterComponent,
    CustomerViewComponent,
    FlightSelectionComponent,
    FlightSelectionDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    CustomerModuleRoutingModule,
    SharedModuleModule
  ]
})
export class CustomerModuleModule { }
