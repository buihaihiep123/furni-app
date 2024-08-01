import { Component ,OnInit} from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit{
  products: any[] = [];
  categoryId: string;
  search: string = '';
  categories: any[] = [];
  nameFilter: string = '';
  detailproduct: any;
  q:number=1;
  

  constructor(private route: ActivatedRoute, private productService: ProductService,private categoryService:CategoryService, private cart: CartService,) {
    this.categoryId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.getProducts();
    this.loadCategories();
    this.getallProducts();
  }

  getProducts(): void {
    this.productService.getProductsByCategoryId(this.categoryId, this.search).subscribe(data => {
      this.products = data.result;
    });
  }
  getallProducts(): void {
    this.productService.getAllProducts(this.search).subscribe(data => {
      this.products = data.result;
    });
  }
  onSearch(): void {
    this.getProducts();
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
  addToCart(product: any) {
    this.cart.addToCart(product);
  }

}