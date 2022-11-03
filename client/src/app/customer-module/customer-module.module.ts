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


@NgModule({
  declarations: [
    CustomerLayoutComponent,
    BookingFlightComponent,
    SearchFlightComponent,
    PersonalFlightComponent,
    RegisterComponent,
    CustomerViewComponent,
  ],
  imports: [
    CommonModule,
    CustomerModuleRoutingModule,
    SharedModuleModule
  ]
})
export class CustomerModuleModule { }
