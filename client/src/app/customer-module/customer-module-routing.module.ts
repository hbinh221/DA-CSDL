import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
 {
  path: '',
  component: CustomerViewComponent
 },
 {
  path: 'register',
  component: RegisterComponent
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerModuleRoutingModule { }
