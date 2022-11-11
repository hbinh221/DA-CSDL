import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminModuleRoutingModule } from './admin-module-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AdminGuard } from '../guards/admin.guard';
import { LocationListComponent } from './location-list/location-list.component';
import { ListBaseComponent } from './shared/list-base/list-base.component';
import { ModelBaseComponent } from './shared/modal-base/modal-base.component';
import { AirlineListComponent } from './airline-list/airline-list.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { RankListComponent } from './rank-list/rank-list.component';
import { PlaneListComponent } from './plane-list/plane-list.component';
import { FlightListComponent } from './flight-list/flight-list.component';
import { PassengerListComponent } from './passenger-list/passenger-list.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { LocationModalComponent } from './location-list/partials/location-modal/location-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AirlineModalComponent } from './airline-list/partials/airline-modal/airline-modal.component';
import { FlightModalComponent } from './flight-list/partials/flight-modal/flight-modal.component';
import { PaymentModalComponent } from './payment-list/partials/payment-modal/payment-modal.component';
import { PromotionModalComponent } from './promotion-list/partials/promotion-modal/promotion-modal.component';
import { RankModalComponent } from './rank-list/partials/rank-modal/rank-modal.component';


@NgModule({
  declarations: [
    AdminLayoutComponent,
    LocationListComponent,
    ListBaseComponent,
    ModelBaseComponent,
    AirlineListComponent,
    PaymentListComponent,
    PromotionListComponent,
    RankListComponent,
    PlaneListComponent,
    FlightListComponent,
    PassengerListComponent,
    TicketListComponent,
    LocationModalComponent,
    AirlineModalComponent,
    FlightModalComponent,
    PaymentModalComponent,
    PromotionModalComponent,
    RankModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AdminModuleRoutingModule,
    SharedModuleModule,
  ],
  providers: [AdminGuard],
})
export class AdminModuleModule { }
