import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:3000/api/category';

  constructor(private http: HttpClient) { }

  getCategories(name?: string): Observable<any> {
    const url = name ? `${this.baseUrl}?name=${name}` : this.baseUrl;
    return this.http.get<any>(url);
  }
}
