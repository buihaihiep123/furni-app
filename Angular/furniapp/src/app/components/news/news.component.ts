import { Component,OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';
import * as moment from 'moment';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit{

  news: any[] = [];
  q:number=1;
  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.getNews();
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