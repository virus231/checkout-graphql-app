export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
}

export interface CartItemInput {
  id: string;
  quantity: number;
}
