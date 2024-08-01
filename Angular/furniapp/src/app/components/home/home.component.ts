import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { NewsService } from 'src/app/services/news.service';
import * as moment from 'moment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  products: any[] = [];
  search: string = '';
  q:number=1;
  p:number=1;
  news: any[] = [];

  constructor(private app:AppService,private newsService: NewsService){}
  ngOnInit(): void {
    this.getProducts();
    this.getNews();
  }

  getProducts(): void {
    this.app.getAllProducts(this.search).subscribe(data => {
      this.products = data.result;
    });
  }
  onSearch(): void {
    this.getProducts();
  }
 getNews(): void {
  this.newsService.getNews().subscribe(data => {
    this.news = data.result;
    console.log(this.news)
  });
}
formatDate(date: string): string {
  return moment(date).format('DD/MM/YYYY');
}

}