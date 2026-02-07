export interface Client {
  id: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  createdAt?: string;
}

export interface ClientResponse {
  data: Client[];
  page: number;
  perPage: number;
  hasNextPage: boolean;
}