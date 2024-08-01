import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiBaseUrl = 'http://localhost:3000/api/favorite';

  constructor(private http: HttpClient) {}

   addToFavorites(productId: number): Observable<any> {
    const loginData = sessionStorage.getItem('login');
    if (loginData) {
      const body = {
        account_id: JSON.parse(loginData).account_id,
        product_id: productId
      };
      return this.http.post<any>(this.apiBaseUrl, body);
    }
    return new Observable<any>();
  }

//   removeFromFavorites(productId: number): Observable<any> {
//     const loginData = sessionStorage.getItem('login');
//     if (loginData) {
//       const params = new HttpParams()
//         .set('account_id', JSON.parse(loginData).account_id)
//         .set('product_id', productId.toString());
//       return this.http.delete<any>(this.apiBaseUrl, { params });
//     }
//     return new Observable<any>();
//   }

  checkFavorite(accountId: number, productId: number): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/check`, { accountId,productId });
  }
}

