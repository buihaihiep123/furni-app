import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FavoriteService } from 'src/app/services/favorite.service';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router'; // Import Router để điều hướng

@Component({
  selector: 'app-detailproduct',
  templateUrl: './detailproduct.component.html',
  styleUrls: ['./detailproduct.component.css']
})
export class DetailproductComponent implements OnInit {
  productId?: string;
  detailproduct: any;
  isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cart: CartService,
    private favoriteService: FavoriteService,
    private loginService: LoginService,
    private router: Router // Thêm Router vào constructor
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.getProductDetails(Number(this.productId));
      this.checkFavoriteStatus(this.productId);
    });
  }

  addToCart(product: any) {
    this.cart.addToCart(product);
  }

  getProductDetails(productId: number) {
    this.http.get<any>(`http://localhost:3000/api/product/${productId}`).subscribe(
      response => {
        this.detailproduct = response.result;
      },
      error => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  toggleFavorite(): void {
    const loginData = this.loginService.checkLogin();
    if (!loginData) {
      alert('Đăng nhập để có thể yêu thích sản phẩm.');
      this.router.navigate(['/login']); // Chuyển hướng đến trang đăng nhập
      return;
    }

    if (!this.detailproduct || !this.detailproduct.product_id) {
      console.error('Id sản phẩm không xác định');
      return;
    }

    this.isFavorite = !this.isFavorite;

    if (this.isFavorite) {
      // If the product is not in favorites, add it
      this.favoriteService.addToFavorites(this.detailproduct.product_id).subscribe({
        next: res => {
          if (res) {
            this.isFavorite = true;
            alert(res.message);
          }
        }
      });
    } else {
      // If the product is already in favorites, remove it
      this.favoriteService.addToFavorites(this.detailproduct.product_id).subscribe({
        next: res => {
          if (res) {
            this.isFavorite = false;
            alert(res.message);
          }
        }
      });
    }
  }

  checkFavoriteStatus(productId: any): void {
    const loginData = this.loginService.checkLogin();
    if (loginData) {
      const parsedProductId = Number(productId);
      // If user is logged in, check if the product is in favorites
      this.favoriteService.checkFavorite(loginData.account_id, parsedProductId).subscribe({
        next: response => {
          if (response && response.result.length > 0) {
            this.isFavorite = true;
          } else {
            this.isFavorite = false;
          }
        }
      });
    }
  }
}
