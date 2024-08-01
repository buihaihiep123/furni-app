import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string='';
  successMessage: string='';
  errorMessage: string='';

  constructor(private userService: UserService) { }

  onForgotPassword() {
    this.userService.forgotPassword(this.email).subscribe(
      (response) => {
        this.successMessage = response.message;
      },
      (error) => {
        this.errorMessage = error.message;
      }
    );
  }
}
