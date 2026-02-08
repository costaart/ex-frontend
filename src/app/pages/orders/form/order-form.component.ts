import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { OrderService } from '../order.service';
import { ClientService } from '../../clients/client.service';
import { ProductService } from '../../products/product.service';
import { Client } from '../../clients/client.model';
import { Product } from '../../products/product.model';
import { ActivatedRoute } from '@angular/router';

interface OrderItemRow {
  productId: string;
  quantity: number;
}

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  clients: Client[] = [];
  products: Product[] = [];

  selectedClientId: string = '';
  
  items: OrderItemRow[] = [
    { productId: '', quantity: 1 }
  ];

  orderId: string | null = null;
  isViewMode = false;

  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private clientService: ClientService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadDependencies();
    this.orderId = this.route.snapshot.paramMap.get('id');

    if (this.orderId) {
      this.isViewMode = true;
      this.loadOrder(this.orderId);
    }
  }

  loadDependencies() {
    this.clientService.getAll(1, 100).subscribe(res => this.clients = res.data);
    this.productService.getAll(1, 100).subscribe(res => this.products = res.data);
  }

  loadOrder(id: string) {
    this.isLoading = true;
    this.orderService.getById(id).subscribe({
      next: (order: any) => {
        console.log('PEDIDO CARREGADO:', order);

        this.selectedClientId = order.client?.id || order.clientId;

        if (order.items && Array.isArray(order.items)) {
           this.items = order.items.map((item: any) => ({
             productId: item.product?.id || item.productId,
             quantity: item.quantity
           }));
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Erro', 'Não foi possível carregar o pedido.', 'error');
        this.router.navigate(['/pedidos']);
      }
    });
  }

  addNewLine() {
    this.items.push({ productId: '', quantity: 1 });
  }

  removeLine(index: number) {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
    } else {
      this.items[0] = { productId: '', quantity: 1 };
    }
  }

  getProductDetails(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  isProductDisabled(productId: string, currentRowIndex: number): boolean {
    return this.items.some((item, index) => 
      index !== currentRowIndex && item.productId === productId
    );
  }

  getLineSubtotal(item: OrderItemRow): number {
    const product = this.getProductDetails(item.productId);
    if (!product) return 0;
    return Number(product.valorVenda) * item.quantity;
  }

  onSubmit() {
    if (!this.selectedClientId) {
      Swal.fire('Erro', 'Selecione o Cliente.', 'warning');
      return;
    }

    const validItems = this.items.filter(i => i.productId && i.quantity > 0);

    if (validItems.length === 0) {
      Swal.fire('Erro', 'Adicione itens ao pedido.', 'warning');
      return;
    }

    this.isLoading = true;

    const orderDto = {
      clientId: this.selectedClientId,
      items: validItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.orderService.create(orderDto).subscribe({
      next: () => {
        Swal.fire('Sucesso', 'Pedido criado!', 'success');
        this.router.navigate(['/pedidos']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        Swal.fire('Erro', 'Falha ao criar pedido.', 'error');
      }
    });
  }
  
}