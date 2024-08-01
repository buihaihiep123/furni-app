import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  user: any = {};
  successMessage: string = '';

  constructor(private userService: UserService, private router: Router) { }

  onChangePassword() {
    this.userService.changePassword(this.user).subscribe(
      (response) => {
        this.successMessage = response.message;
        // Redirect to login page after password change
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Redirect after 2 seconds
      },
      (error) => {
        console.error(error); // Handle error
      }
    );
  }
}
