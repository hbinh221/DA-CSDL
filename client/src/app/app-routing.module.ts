import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-module/admin-layout/admin-layout.component';
import { CustomerLayoutComponent } from './customer-module/customer-layout/customer-layout.component';
import { RegisterComponent } from './customer-module/register/register.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [

  {
    path: 'admin',
    component: AdminLayoutComponent,
    // canActivate: [CheckLoadingService],
    children: [
      {
        path: '',
        loadChildren: () => import('./admin-module/admin-module.module').then((m) => m.AdminModuleModule),
        // canLoad: [AdminGuard]
      },
]
},
  {
    path: '',
    component: CustomerLayoutComponent,
  },
  {
    path: 'customer',
    component: CustomerLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'customer',
        pathMatch: 'full'
},

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
