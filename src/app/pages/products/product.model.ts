export interface ProductImage {
  id: string;
  url: string; 
  productId: string;
}

export interface Product {
  id: string;
  descricao: string;
  valorVenda: string | number; 
  estoque: number;
  images: ProductImage[];
  createdAt?: string;
}

export interface ProductResponse {
  data: Product[];
  page: number;
  perPage: number;
  hasNextPage: boolean;
}