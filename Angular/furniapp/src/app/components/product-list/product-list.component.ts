import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { CartService } from 'src/app/services/cart.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categoryId: string | null = null;
  search: string = '';
  categories: any[] = [];
  nameFilter: string = '';
  detailproduct: any;
  q:number=1;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.categoryId = params.get('id');
        return this.productService.getProductsByCategoryId(this.categoryId!, this.search);
      })
    ).subscribe(data => {
      this.products = data.result;
    });

    this.loadCategories();
  }

  onSearch(): void {
    if (this.categoryId) {
      this.productService.getProductsByCategoryId(this.categoryId, this.search).subscribe(data => {
        this.products = data.result;
      });
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories(this.nameFilter).subscribe({
      next: (data) => {
        this.categories = data.result;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  addToCart(product: any): void {
    this.cart.addToCart(product);
  }
}
