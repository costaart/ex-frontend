import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'product-form.component.html',
  styleUrls: ['product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productData = {
    descricao: '',
    valorVenda: 0,
    estoque: 0
  };
  
  selectedFiles: File[] = []; 
  productId: string | null = null;
  isEditMode = false;
  isLoading = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string) {
    this.isLoading = true;
    this.productService.getById(id).subscribe({
      next: (response: any) => {
        const data = response.product;

        this.productData = {
          descricao: data.descricao,
          valorVenda: Number(data.valorVenda), 
          estoque: data.estoque
        };
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Erro', 'Erro ao carregar produto.', 'error');
        this.router.navigate(['/produtos']);
      }
    });
  }

  onFileSelected(event: any) {
    if (event.target.files) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  onSubmit() {
    this.isLoading = true;

    if (this.isEditMode && this.productId) {
      this.productService.update(this.productId, this.productData).subscribe({
        next: () => {
          Swal.fire('Sucesso', 'Produto atualizado com sucesso!', 'success');
          this.router.navigate(['/produtos']);
        },
        error: () => {
          this.isLoading = false;
          Swal.fire('Erro', 'Erro ao atualizar produto.', 'error');
        }
      });

    } else {
      const newProduct = {
        ...this.productData,
        images: this.selectedFiles 
      };

      this.productService.create(newProduct).subscribe({
        next: () => {
          Swal.fire('Sucesso', 'Pedido criado!', 'success');
          this.router.navigate(['/produtos']);
        },
        error: () => {
          this.isLoading = false;
          Swal.fire('Erro', 'Erro ao criar produto.', 'error');
        }
      });
    }
  }
}