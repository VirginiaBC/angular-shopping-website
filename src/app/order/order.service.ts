import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'https://fakestoreapi.com/carts/user/';

  constructor(private http: HttpClient) {}

  getUserOrder(userId: number): Observable<any> {
    return this.http.get(`https://fakestoreapi.com/carts/user/${userId}`);
  }
}
