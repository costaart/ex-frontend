import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // DatePipe para formatar datas
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { OrderService } from '../order.service';
import { Order } from '../order.model';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'order-list.component.html',
styleUrls: ['order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  page = 1;
  perPage = 10;
  hasNextPage = false;
  searchTerm = '';
  isLoading = false;
  isAdmin = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole(['ADMIN']);
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getAll(this.page, this.perPage, this.searchTerm).subscribe({
      next: (res) => {
        this.orders = res.data;
        this.hasNextPage = res.hasNextPage;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.page = 1;
    this.loadOrders();
  }

  nextPage() {
    if (this.hasNextPage) {
      this.page++;
      this.loadOrders();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadOrders();
    }
  }

  onDelete(id: string) {
    Swal.fire({
      title: 'Cancelar Pedido?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',

    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.delete(id).subscribe(() => {
          Swal.fire('Cancelado!', 'O pedido foi removido.', 'success');
          this.loadOrders();
        });
      }
    });
  }
}