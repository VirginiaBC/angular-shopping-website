import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list.component';
import { ProductListService } from './product-list.service';

@NgModule({
  imports: [CommonModule],
  declarations: [ProductListComponent],
  providers: [ProductListService],
  exports: [ProductListComponent],
})
export class ProductListModule {}
