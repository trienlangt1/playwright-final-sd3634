import { ApiClient } from './ApiClient';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export interface PlaceOrderPayload {
  items: OrderItem[];
  recipientName: string;
  recipientPhone: string;
  address: string;
  paymentMethod: 'cash' | 'card';
  totalPrice: number;
}

export interface Order extends PlaceOrderPayload {
  id: string;
  status: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class OrderApi {
  constructor(private apiClient: ApiClient) {}

  async placeOrder(token: string, payload: PlaceOrderPayload): Promise<Order> {
    return this.apiClient.post<Order>('/orders', payload, token);
  }

  async getOrders(token: string, params?: { search?: string; page?: number; limit?: number }): Promise<OrdersResponse> {
    const query = params
      ? '?' + new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined) acc[key] = String(value);
            return acc;
          }, {} as Record<string, string>)
        ).toString()
      : '';
    return this.apiClient.get<OrdersResponse>(`/orders${query}`, token);
  }
}