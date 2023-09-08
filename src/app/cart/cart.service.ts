import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CartService {
  private cartItems: any[] = [];
  private cartSubject = new BehaviorSubject<any[]>([]);

  constructor() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  getCartItems() {
    return this.cartSubject.asObservable();
  }

  addToCart(product: any) {
    this.cartItems.push(product);
    this.cartSubject.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  removeFromCart(product: any) {
    const index = this.cartItems.indexOf(product);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.cartSubject.next(this.cartItems);
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  clearCart() {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems);
    localStorage.removeItem('cart');
  }
}
