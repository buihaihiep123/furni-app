import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface datapay{
    amount:number;
    bankCode:string;
    language:string;
    orderId:number;
}

@Injectable({
  providedIn: 'root'
})
export class vnPayService {
  private apiBaseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

   createURL(data: datapay): Observable<any> {
      return this.http.post<any>(`${this.apiBaseUrl}/create_payment_url`, data);
  } 
  vnpay_ipn(data: any): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/vnpay_ipn`, {params:data});
} 

}

