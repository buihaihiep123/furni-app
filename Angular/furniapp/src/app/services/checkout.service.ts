import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
  }
  createbill(checkoutData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/createbill`, checkoutData);
  }
}
