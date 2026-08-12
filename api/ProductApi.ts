import { ApiClient } from './ApiClient';

export interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  emoji: string;
  tag: string;
  category: string;
  stock: number;
}

export class ProductApi {
  constructor(private apiClient: ApiClient) {}

  async getProducts(token: string): Promise<Product[]> {
    return this.apiClient.get<Product[]>('/products', token);
  }
}