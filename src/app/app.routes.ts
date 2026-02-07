import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';

import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './pages/layout/main-layout.component';
import { ProductsListComponent } from './pages/products/list/products-list.component';
import { ProductFormComponent } from './pages/products/form/product-form.component'

import { ClientListComponent } from './pages/clients/list/client-list.component';
import { ClientFormComponent } from './pages/clients/form/client-form.component';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  
  { 
    path: '', 
    component: MainLayoutComponent,
    canActivate: [authGuard], 
    children: [
      { path: '', redirectTo: 'produtos', pathMatch: 'full' }, 
      
      { path: 'produtos', component: ProductsListComponent },
      
      { path: 'produtos/novo', component: ProductFormComponent, canActivate: [roleGuard(['ADMIN'])] }, 
      { path: 'produtos/:id', component: ProductFormComponent, canActivate: [roleGuard(['ADMIN'])] }, 

      { path: 'clientes', component: ClientListComponent },
      { path: 'clientes/novo', component: ClientFormComponent, canActivate: [roleGuard(['ADMIN'])] },
      { path: 'clientes/:id', component: ClientFormComponent },
    ]
  },

  { path: '**', redirectTo: '' }
];