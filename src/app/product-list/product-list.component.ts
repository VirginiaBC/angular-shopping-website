import { Component, OnInit } from '@angular/core';
import { ProductListService } from './product-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  constructor(private product: ProductListService, private router: Router) {}
  showProductList: boolean = true;
  productList: any[] = [];

  ngOnInit() {
    this.product.getProduct().subscribe((res) => (this.productList = res));
  }

  navigateToProductDetails(productId: number) {
    this.router.navigate(['/product-details', productId]);
  }
}
