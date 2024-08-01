import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private apiUrl = 'http://localhost:3000/api/new';  // URL của API

  constructor(private http: HttpClient) { }

  getNews(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


  getNew(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createNew(news: any): Observable<any> {
    return this.http.post(this.apiUrl, news);
  }

  updateNew(id: string, news: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, news);
  }

  deleteNew(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
