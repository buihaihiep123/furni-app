import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';
import * as moment from 'moment';
@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit {
  newsDetail: any;
  new_id!:number;
  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) { // Kiểm tra id có khác null không
      this.new_id=Number(id)
      this.newsService.getNew(this.new_id).subscribe(data => {
        this.newsDetail = data.result;
      });
    }
  }
  formatDate(date: string): string {
    return moment(date).format('DD/MM/YYYY');
  }
}
