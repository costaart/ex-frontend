import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../utils/enviroment';
import { Product, ProductResponse } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 1, perPage: number = 10, search: string = ''): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('perPage', perPage);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ProductResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(data: { descricao: string; valorVenda: number; estoque: number; images?: File[] }): Observable<any> {
    const formData = new FormData();
    formData.append('descricao', data.descricao);
    formData.append('valorVenda', data.valorVenda.toString());
    formData.append('estoque', data.estoque.toString());

    if (data.images && data.images.length > 0) {
      data.images.forEach(file => {
        formData.append('images', file); 
      });
    }

    return this.http.post(this.apiUrl, formData);
  }

  update(id: string, data: Partial<Product>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}