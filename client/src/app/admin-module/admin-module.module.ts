import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminModuleRoutingModule } from './admin-module-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AdminGuard } from '../guards/admin.guard';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationDrawerComponent } from './location-list/partials/location-drawer/location-drawer.component';
import { ListBaseComponent } from './shared/list-base/list-base.component';
import { ModelBaseComponent } from './shared/modal-base/modal-base.component';
import { AirlineListComponent } from './airline-list/airline-list.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { RankListComponent } from './rank-list/rank-list.component';


@NgModule({
  declarations: [
    AdminLayoutComponent,
    LocationListComponent,
    LocationDrawerComponent,
    ListBaseComponent,
    ModelBaseComponent,
    AirlineListComponent,
    PaymentListComponent,
    PromotionListComponent,
    RankListComponent,
  ],
  imports: [
    CommonModule,
    AdminModuleRoutingModule,
    SharedModuleModule,
  ],
  providers: [AdminGuard],
})
export class AdminModuleModule { }
