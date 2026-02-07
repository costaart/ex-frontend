import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';

import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './pages/layout/main-layout.component';
import { ProductsListComponent } from './pages/products/list/products-list.component';
import { ProductFormComponent } from './pages/products/form/product-form.component'

import { Component } from '@angular/core';
// @Component({template: '<h2>Gestão de Pedidos (Em breve)</h2>', standalone: true}) class PedidosPlaceholder {}
// @Component({template: '<h2>Gestão de Clientes (Em breve)</h2>', standalone: true}) class ClientesPlaceholder {}

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  
  { 
    path: '', 
    component: MainLayoutComponent,
    canActivate: [authGuard], // Protege o acesso
    children: [
      { path: '', redirectTo: 'produtos', pathMatch: 'full' }, 
      
      { path: 'produtos', component: ProductsListComponent },
      
      // { path: 'pedidos', component: PedidosPlaceholder },
      { path: 'produtos/novo', component: ProductFormComponent, canActivate: [roleGuard(['ADMIN'])] }, 
      { path: 'produtos/:id', component: ProductFormComponent, canActivate: [roleGuard(['ADMIN'])] },  
      // { path: 'clientes', component: ClientesPlaceholder },
    ]
  },

  { path: '**', redirectTo: '' }
];