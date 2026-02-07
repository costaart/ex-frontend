import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.model';

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
        alert('Erro ao carregar produto.');
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
          alert('Produto atualizado com sucesso!');
          this.router.navigate(['/produtos']);
        },
        error: () => {
          this.isLoading = false;
          alert('Erro ao atualizar produto.');
        }
      });

    } else {
      const newProduct = {
        ...this.productData,
        images: this.selectedFiles 
      };

      this.productService.create(newProduct).subscribe({
        next: () => {
          alert('Produto criado com sucesso!');
          this.router.navigate(['/produtos']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          alert('Erro ao criar produto.');
        }
      });
    }
  }
}