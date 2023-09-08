import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.total = this.cartItems
      .reduce((sum, item) => sum + item.price, 0)
      .toFixed(2);
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item);
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }

  goBackToProductList() {
    this.router.navigate(['/product-list']);
  }
}
