import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../utils/enviroment';
import { Order, OrderResponse, CreateOrderDto } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 1, perPage: number = 10, search: string = ''): Observable<OrderResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('perPage', perPage);

    if (search) params = params.set('search', search);

    return this.http.get<OrderResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(order: CreateOrderDto): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}