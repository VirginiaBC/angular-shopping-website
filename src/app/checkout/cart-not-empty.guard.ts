import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../cart/cart.service';

@Injectable()
export class CartNotEmptyGuard implements CanActivate {
  constructor(private cartService: CartService, private router: Router) {}
  cart: any[] = [];
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.cartService.getCartItems().subscribe((items) => {
      this.cart = items;
    });

    if (this.cart.length > 0) {
      return true;
    } else {
      this.router.navigate(['/product-list']);
      return false;
    }
  }
}
