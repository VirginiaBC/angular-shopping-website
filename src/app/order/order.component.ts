import { Component, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { ProductListService } from '../product-list/product-list.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  userCarts: any = {};
  productDetails: any[] = [];
  constructor(
    private orderService: OrderService,
    private productListService: ProductListService
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    console.log(userId);
    this.orderService.getUserOrder(userId).subscribe((cartsData) => {
      this.userCarts = cartsData;

      this.userCarts.forEach((cart) => {
        cart.products.forEach((product) => {
          this.productListService
            .getProductById(product.productId)
            .subscribe((productDetail) => {
              this.productDetails.push(productDetail);
            });
        });
      });
    });

    console.log(this.productDetails);
  }
}
