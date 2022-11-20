import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from '../guards/loggedIn.guard';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { FlightSelectionComponent } from './flight-selection/flight-selection.component';
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerModuleRoutingModule { }
