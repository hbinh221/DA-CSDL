import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirlineListComponent } from './airline-list/airline-list.component';
import { FlightListComponent } from './flight-list/flight-list.component';
import { LocationListComponent } from './location-list/location-list.component';
import { PassengerListComponent } from './passenger-list/passenger-list.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PlaneListComponent } from './plane-list/plane-list.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { RankListComponent } from './rank-list/rank-list.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';

const routes: Routes = [
  {
    path: 'location',
    component: LocationListComponent
  },
  {
    path: 'airline',
    component: AirlineListComponent
  },
  {
    path: 'promotion',
    component: PromotionListComponent
  },
  {
    path: 'plane',
  component: PlaneListComponent
  },
  {
    path: 'flight',
    component: FlightListComponent
  },
  {
    path: 'passenger',
    component: PassengerListComponent
  },
  {
    path: 'ticket',
    component: TicketListComponent
  },
  {
    path: 'payment',
    component: PaymentListComponent
  },
  {
    path: 'rank',
    component: RankListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminModuleRoutingModule { }
