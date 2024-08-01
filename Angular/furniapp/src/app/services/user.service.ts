import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/account'; // Địa chỉ của API Node.js

  constructor(private http: HttpClient) { }

  signup(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signupUSER`, user);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgotPasswordUSER`, { email });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUSER`);
  }

  updateUser(user: any): Observable<any> {
    const token = sessionStorage.getItem('login');
    if (token) {
      const convertToken = JSON.parse(token);
      const headers = new HttpHeaders().set('authorization', `Bearer ${convertToken.token}`);
      return this.http.put<any>(`${this.apiUrl}/updateUSER`, user, { headers });
    } else {
      return of(null);
    }
  }
  

  checkToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/checkTokenUSER`);
  }

  changePassword(user: any): Observable<any> {
    const token = sessionStorage.getItem('login');
    if (token) {
      const convertToken = JSON.parse(token)
      const headers = new HttpHeaders().set('authorization', `Bearer ${convertToken.token}`);
      return this.http.post<any>(`${this.apiUrl}/changePasswordUSER`,user, { headers});
    }
    else {
      return of(null);
    }

  }
  // getUserById(userId: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/getUSERById/${userId}`);
  // }
  getUserById(userId: number): Observable<any> {
    const token = sessionStorage.getItem('login');
    if (token) {
      const convertToken = JSON.parse(token)
      const headers = new HttpHeaders().set('authorization', `Bearer ${convertToken.token}`);
      return this.http.get<any>(`${this.apiUrl}/getUSERById/${userId}`, { headers });
    }
    else {
      return of(null);
    }
  }
}
