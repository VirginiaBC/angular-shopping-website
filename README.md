# angular-shopping-website

# Building a Shopping Cart with Angular and Fake Store API

In the world of web development, creating a shopping cart application is a fundamental step towards mastering the art of building dynamic and interactive websites. In this blog post, we'll explore how to build a shopping cart using Angular, a popular front-end framework, and leverage the Fake Store API to populate our cart with products. By the end of this tutorial, you'll have a fully functional shopping cart application with features like product listing, product details, cart management, order history, and checkout.

### Fold Structure

![image-20230908162438935](/Users/virginiawu/Library/Application Support/typora-user-images/image-20230908162438935.png)

![image-20230908162521782](/Users/virginiawu/Library/Application Support/typora-user-images/image-20230908162521782.png)

## Fetching Data from the Fake Store API

In this project, we'll use the Fake Store API (https://fakestoreapi.com/) to simulate a real e-commerce experience. This API provides a variety of products for our shopping cart. To fetch data from the API, we can use Angular's built-in HTTP client module.

```typescript
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

```

Now, we create `product.service.ts` file to interact with the API and retrieve product data.Then, we could implement methods in the component to fetch products, product details, and manage the cart.

## Creating the Components

In Angular, components are building blocks of the user interface. Create the necessary components for your project, such as `product-list`, `product-detail`, `cart`, `order`, `checkout`, and `login`.

### Product List

In the `product-list` component, fetch and display a list of products from the Fake Store API. Use Angular's data binding to display product information and provide a navigation to view the product details.

```typescript
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

```

### Product Detail

When a user clicks on a product in the product list, navigate to the `product-detail` component. Retrieve the selected product's details from the API and display them.

```typescript
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
    this.cartService.addToCart(this.product);
  }

  goBackToProductList() {
    this.router.navigate(['/product-list']);
  }
}

```

### Cart

Create a shopping cart component to add and remove products from the cart. Implement functions to calculate the total price of items in the cart.

```typescript
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

```

### Order

The `order` component should display the user's order history, showing the products they've purchased previously.

```typescript
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

```

### Checkout

In the `checkout` component, allow users to review their cart, enter shipping information, and complete the purchase. Implement logic to finalize the order.

```typescript
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

```

### Login

Implement user authentication.

```typescript
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  token: string | null = null;
  errorMessage: string = '';
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  login() {
    this.errorMessage = '';
    const loginData = {
      username: this.username,
      password: this.password,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    this.http
      .post<any>('https://fakestoreapi.com/auth/login', loginData, httpOptions)
      .subscribe(
        (response) => {
          if (response && response.token) {
            this.token = response.token;
            console.log('Login successful. Token:', this.token);

            this.getUserID();

            localStorage.setItem('token', this.token);

            this.isLoggedIn = true;
            this.router.navigate(['/product-list']);
          } else {
            this.errorMessage = 'Login fail, check your email or password';
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Login fail, check your email or password';
        }
      );
  }

  getUserID() {
    this.http
      .get('https://fakestoreapi.com/users')
      .subscribe((usersData: any[]) => {
        const user = usersData.find((user) => user.username === this.username);
        if (user) {
          const userId = user.id;
          console.log('UserID:', userId);
          localStorage.setItem('userId', userId);
        }
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;

    this.router.navigate(['/login']);
  }
}

```

## Routing and Navigation

Configure Angular routing to navigate between the different components. Define routes for product listing, product details, cart, order history, login, and checkout. Use the Angular Router module to handle navigation.

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartNotEmptyGuard } from './checkout/cart-not-empty.guard';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/auth.guard';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  { path: '', component: ProductListComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: 'product-details/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [CartNotEmptyGuard],
  },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

```

## Styling and UI

Make your application visually appealing by applying CSS.

## Conclusion

Building a shopping cart application with Angular can be a rewarding experience. By following the steps outlined in this guide, you'll be well on your way to creating a robust and user-friendly e-commerce solution. Remember to continuously test and improve your project to provide the best shopping experience for your users. Good luck with your Angular shopping cart project!

##
