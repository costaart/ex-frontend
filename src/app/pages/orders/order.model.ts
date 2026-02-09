export interface OrderClient {
  id: string;
  razaoSocial: string;
  cnpj: string;
}

export interface OrderUser {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  client?: OrderClient;
  user?: OrderUser;
  itemsCount: number;
}

export interface OrderResponse {
  data: Order[];
  page: number;
  perPage: number;
  hasNextPage: boolean;
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  clientId: string;
  items: CreateOrderItem[];
}