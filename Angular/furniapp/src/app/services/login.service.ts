import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
const api = 'http://localhost:3000/api'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }
  login(body:any):any{
    return this.http.post(`http://localhost:3000/account/loginUSER`,body);
  }
  checkLogin():any{
    let jsonData= sessionStorage.getItem('login');
    if(jsonData){
      return JSON.parse(jsonData);
    }
    return false;
  }
  decodeToken() {
    const gettoken = sessionStorage.getItem('login');
    var sessionData = JSON.parse(String(gettoken));
    var token = sessionData.token;
    if (!token) {
      throw new Error('Token is not present in sessionStorage');
    }
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }
    const payloadBase64 = tokenParts[1];
    const payload = JSON.parse(decodeURIComponent(escape(atob(payloadBase64))));
    return payload;
  }
}
