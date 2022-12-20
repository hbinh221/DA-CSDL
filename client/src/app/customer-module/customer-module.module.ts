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
import { FlightSelectionPassengerInfoComponent } from './flight-selection/partials/flight-selection-passenger-info/flight-selection-passenger-info.component';
import { FlightSelectionPassengerServiceComponent } from './flight-selection/partials/flight-selection-passenger-service/flight-selection-passenger-service.component';
import { PassengerServiceMilkTeaModalComponent } from './flight-selection/partials/flight-selection-passenger-service/partials/passenger-service-milk-tea-modal/passenger-service-milk-tea-modal.component';
import { PassengerServiceBaggageModalComponent } from './flight-selection/partials/flight-selection-passenger-service/partials/passenger-service-baggage-modal/passenger-service-baggage-modal.component';
import { FlightSelectionPassengerTicketComponent } from './flight-selection/partials/flight-selection-passenger-ticket/flight-selection-passenger-ticket.component';
import { FlightSelectionPassengerPaymentComponent } from './flight-selection/partials/flight-selection-passenger-payment/flight-selection-passenger-payment.component';
import { FormatMoneyPipe } from '../pipes/format-money.pipe';


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
    FlightSelectionPassengerInfoComponent,
    FlightSelectionPassengerServiceComponent,
    PassengerServiceMilkTeaModalComponent,
    PassengerServiceBaggageModalComponent,
    FlightSelectionPassengerTicketComponent,
    FlightSelectionPassengerPaymentComponent,
    FormatMoneyPipe,
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
