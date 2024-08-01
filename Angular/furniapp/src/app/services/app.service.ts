import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private baseUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) { }

  getAllProducts(name: string): Observable<any> {
    return this.http.get(this.baseUrl, {
      params: { name }
    });
  }
}
//   onFavorite(data:any):Observable<any>{
//     return this.http.post<any>(`${api}/favorite`,data);
//   }

// }
