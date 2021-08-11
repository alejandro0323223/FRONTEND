import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { LoginComponent } from '../../login/login.component';
import { CategoriasComponent } from '../../categorias/categorias.component';
import { ExcluidosComponent } from '../../excluidos/excluidos.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'listadoproductos',     component: TableListComponent },
    { path: 'excluidos',     component: ExcluidosComponent },
    { path: 'categorias',     component: CategoriasComponent },
    { path: 'login',          component: LoginComponent },
];
