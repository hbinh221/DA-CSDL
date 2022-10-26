import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-module/admin-layout/admin-layout.component';
import { CustomerLayoutComponent } from './customer-module/customer-layout/customer-layout.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    // canActivate: [CheckLoadingService],
    children: [
      {
        path: '',
        loadChildren: () => import('./admin-module/admin-module.module').then((m) => m.AdminModuleModule),
    },
]
  },
  {
    path: 'customer',
    component: CustomerLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./customer-module/customer-module.module').then((m) => m.CustomerModuleModule),
    },
  ]
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
