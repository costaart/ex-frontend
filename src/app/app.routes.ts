import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './pages/layout/main-layout.component';
import { authGuard } from './auth/auth.guard';

import { Component } from '@angular/core';
@Component({template: '<h2>Lista de Pedidos</h2>', standalone: true}) class PedidosPlaceholder {}
@Component({template: '<h2>Lista de Produtos</h2>', standalone: true}) class ProdutosPlaceholder {}
@Component({template: '<h2>Lista de Clientes</h2>', standalone: true}) class ClientesPlaceholder {}

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  { 
    path: '', 
    component: MainLayoutComponent,
    canActivate: [authGuard], 
    children: [
      { path: '', redirectTo: 'pedidos', pathMatch: 'full' },
      { path: 'pedidos', component: PedidosPlaceholder },
      { path: 'produtos', component: ProdutosPlaceholder },
      { path: 'clientes', component: ClientesPlaceholder },
    ]
  },

  { path: '**', redirectTo: '' }
];