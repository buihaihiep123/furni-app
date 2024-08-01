// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:3000/api/product';
  private Url = 'http://localhost:3000/api/products';
  constructor(private http: HttpClient) { }

  getProductsByCategoryId(categoryId: string, search: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/category/${categoryId}`, {
      params: { search }
    });
    
  }
  getAllProducts(name: string): Observable<any> {
    return this.http.get(this.Url, {
      params: { name }
    });
  }
}
