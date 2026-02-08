import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; 
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'products-list.component.html',
  styleUrls: ['products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  page = 1;
  perPage = 10;
  hasNextPage = false;
  searchTerm = '';
  isLoading = false;
  isAdmin = false;

  readonly backendUrl = 'http://localhost:3000'; 

  constructor(private productService: ProductService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.isAdmin = this.authService.hasRole(['ADMIN']);
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getAll(this.page, this.perPage, this.searchTerm).subscribe({
      next: (res) => {
        this.products = res.data;
        this.hasNextPage = res.hasNextPage;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Erro ao carregar produtos');
      }
    });
  }

  onSearch() {
    this.page = 1; 
    this.loadProducts();
  }

  nextPage() {
    if (this.hasNextPage) {
      this.page++;
      this.loadProducts();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadProducts();
    }
  }

  onDelete(id: string) {
    Swal.fire({
      title: 'Deseja apagar esse registro?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', 
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.productService.delete(id).subscribe({
          next: () => {
            this.isLoading = false;
            
            Swal.fire(
              '',
              'Produto excluído com sucesso!',
              'success'
            );
            
            this.loadProducts();
          },
          error: (err) => {
            this.isLoading = false;
            Swal.fire(
              'Erro',
              'Não foi possível excluir o produto.',
              'error'
            );
            console.log(err);
          }
        });
      }
    });
  }
  
  getImageUrl(path: string): string {
    return `${this.backendUrl}${path}`;
  }
}