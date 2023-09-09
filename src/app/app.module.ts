import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ProductListModule } from './product-list/product-list.module';
import { HttpClientModule } from '@angular/common/http';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { CartService } from './cart/cart.service';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartNotEmptyGuard } from './checkout/cart-not-empty.guard';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/auth.guard';
import { OrderComponent } from './order/order.component';
import { LandingComponent } from './landing/landing.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    ProductListModule,
    AppRoutingModule,
    FormsModule,
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    LoginComponent,
    OrderComponent,
    LandingComponent,
  ],
  bootstrap: [AppComponent],
  providers: [CartService, AuthGuard, CartNotEmptyGuard],
})
export class AppModule {}
