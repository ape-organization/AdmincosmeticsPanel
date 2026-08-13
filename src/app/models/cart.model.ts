import { Product } from './product.model';

export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}
