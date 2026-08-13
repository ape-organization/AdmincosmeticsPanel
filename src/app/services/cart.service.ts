import { Injectable, signal } from '@angular/core';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = signal<Cart>({ items: [], totalPrice: 0 });

  getCart() {
    return this.cart.asReadonly();
  }

  addToCart(product: Product) {
    const currentCart = this.cart();
    const existingItem = currentCart.items.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentCart.items.push({ productId: product.id, product, quantity: 1 });
    }

    this.updateCart(currentCart);
  }

  updateQuantity(productId: number, quantity: number) {
    const currentCart = this.cart();
    const item = currentCart.items.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.updateCart(currentCart);
      }
    }
  }

  removeFromCart(productId: number) {
    const currentCart = this.cart();
    currentCart.items = currentCart.items.filter(item => item.productId !== productId);
    this.updateCart(currentCart);
  }

  private updateCart(cart: Cart) {
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    this.cart.set({ ...cart });
  }

  clearCart() {
    this.cart.set({ items: [], totalPrice: 0 });
  }
}
