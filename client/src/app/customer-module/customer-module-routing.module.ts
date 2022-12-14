import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from '../guards/loggedIn.guard';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { FlightSelectionComponent } from './flight-selection/flight-selection.component';
import { FlightSelectionPassengerInfoComponent } from './flight-selection/partials/flight-selection-passenger-info/flight-selection-passenger-info.component';
import { FlightSelectionPassengerPaymentComponent } from './flight-selection/partials/flight-selection-passenger-payment/flight-selection-passenger-payment.component';
import { FlightSelectionPassengerServiceComponent } from './flight-selection/partials/flight-selection-passenger-service/flight-selection-passenger-service.component';
import { FlightSelectionPassengerTicketComponent } from './flight-selection/partials/flight-selection-passenger-ticket/flight-selection-passenger-ticket.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerLayoutComponent,
    pathMatch: 'full'
  },
 {
  path: 'register',
  component: RegisterComponent,
  canActivate: [LoggedInGuard],
 },
 {
  path: 'flight-selection/:type/:fromLocationId/:toLocationId/:fromDate/:toDate/:passenger',
  component: FlightSelectionComponent,
  data: {}
 },
 {
  path: 'passenger-info',
  component: FlightSelectionPassengerInfoComponent,
 },
 {
  path: 'passenger-service',
  component: FlightSelectionPassengerServiceComponent,
 },
 {
  path: 'passenger-ticket',
  component: FlightSelectionPassengerTicketComponent,
 },
 {
  path: 'passenger-payment',
  component: FlightSelectionPassengerPaymentComponent,
 },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerModuleRoutingModule { }
