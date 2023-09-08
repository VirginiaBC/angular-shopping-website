import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ProductListService {
  constructor(private http: HttpClient) {}

  getProduct(): Observable<any> {
    return this.http.get('https://fakestoreapi.com/products');
  }

  getProductById(productId: number): Observable<any> {
    return this.http.get(`https://fakestoreapi.com/products/${productId}`);
  }
}
