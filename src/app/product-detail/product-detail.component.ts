import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductListService } from '../product-list/product-list.service';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  itemId: number;
  product: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductListService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.itemId = +params['id'];
      this.loadProductDetails(this.itemId);
    });
  }

  loadProductDetails(productId: number) {
    this.productService.getProductById(productId).subscribe((data) => {
      this.product = data;
    });
  }

  addToBag() {
    console.log('Added to Bag:', this.product);
    this.cartService.addToCart(this.product);
  }

  goBackToProductList() {
    this.router.navigate(['/product-list']);
  }
}
