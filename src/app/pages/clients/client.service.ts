import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../utils/enviroment';
import { Client, ClientResponse } from './client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 1, perPage: number = 10, search: string = ''): Observable<ClientResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('perPage', perPage);

    if (search) params = params.set('search', search);

    return this.http.get<ClientResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  create(client: Partial<Client>): Observable<any> {
    return this.http.post(this.apiUrl, client);
  }

  update(id: string, client: Partial<Client>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, client);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  consultarCnpj(cnpj: string): Observable<any> {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    return this.http.get(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
  }
}

