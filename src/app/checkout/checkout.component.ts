import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { Router } from '@angular/router';
import { OrderService } from '../order/order.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cart: any[] = [];
  orders: any[] = [];
  discount: number = 20;
  extraFees: number = 10;
  tax: number = 5;
  subTotal: number = 0;
  total: number = 0;
  isOrdered: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe((items) => {
      this.cart = items;
      this.calculateTotals();
    });

    this.orders = [];
  }

  calculateTotals() {
    this.subTotal = this.cart.reduce((sum, curr) => sum + curr.price, 0);
    this.total =
      this.subTotal +
      this.extraFees +
      this.tax -
      (this.subTotal + this.extraFees + this.tax) * 0.2;

    this.subTotal = +this.subTotal.toFixed(2);
    this.total = +this.total.toFixed(2);
  }

  handlePay() {
    const orderData = {
      userId: localStorage.getItem('userId'),
      date: '2020-12-19',
      products: this.cart.map((item) => ({
        productId: item.id,
        quantity: 1,
      })),
    };

    this.http
      .put(`https://fakestoreapi.com/carts/${orderData.userId}`, orderData)
      .subscribe(
        (response) => {
          console.log('Checkout successful. Response:', response);
        },
        (error) => {
          console.error('Checkout failed:', error);
        }
      );

    this.cartService.clearCart();
    this.isOrdered = true;
  }

  navigateToShop() {
    this.router.navigate(['/product-list']);
  }

  goBackToCart() {
    this.router.navigate(['/cart']);
  }
}
