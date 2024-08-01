// user.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userId?: number;
  user: any;

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id']; // Lấy userId từ URL
      this.getUserById(this.userId);
    });
  }

  getUserById(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      data => {
        this.user = data;
      },
      error => {
        console.log(error);
      }
    );
  }
}
