// import { Component, OnInit } from '@angular/core';
// import { LoginService } from 'src/app/services/login.service';

// @Component({
//   selector: 'app-header',
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.css']
// })
// export class HeaderComponent implements OnInit{
//   isLogin:any;
//   constructor(private loginSrv:LoginService){}
//   ngOnInit(): void {
//     this.isLogin =this.loginSrv.checkLogin();
//     console.log(this.isLogin)
//   }
//   onLogout(){
//     sessionStorage.clear();
//     location.reload();
//   }
// }
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // Thêm Router từ @angular/router
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogin: any;
  currentRoute: string;
  constructor(private router: Router, private loginSrv: LoginService) {
    this.currentRoute ='';
  } // Inject Router

  ngOnInit(): void {
    this.isLogin = this.loginSrv.checkLogin();
  }

  goToAccountInfo(): void {
    // Điều hướng đến trang thông tin tài khoản nếu người dùng đã đăng nhập
    // Sử dụng Router để điều hướng đến trang cụ thể (ví dụ: /user/:id)
    if (this.isLogin) {
      this.router.navigate(['/user', this.isLogin.account_id]); // Điều hướng đến trang thông tin tài khoản với userId
    } else {
      // Điều hướng đến trang đăng nhập nếu người dùng chưa đăng nhập
      this.router.navigate(['/login']);
    }
  }

  onLogout(): void {
    sessionStorage.clear();
    location.reload();
  }
  isActive(route: string): boolean {
    return this.currentRoute === route;
  }
}
