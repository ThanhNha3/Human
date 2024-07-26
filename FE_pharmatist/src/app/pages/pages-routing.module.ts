import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./client/client.module').then((m) => m.ClientModule),
  },
  // {
  //   path: 'admin',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('./admin/admin.module').then((m) => m.AdminModule),
  //   data: { breadcrumb: 'Trang chủ' },
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
