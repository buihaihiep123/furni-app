import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService,private routeHome:Router) {
    this.signupForm = this.fb.group({
      account_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone_number: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.userService.signup(this.signupForm.value).subscribe(
        response => {
          console.log('Signup successful', response);
          alert(response.message)
          this.routeHome.navigate(['/login'])
          // Handle success response (e.g., show a success message)
        },
        error => {
          console.error('Signup failed', error);
          // Handle error response (e.g., show an error message)
        }
      );
    }
  }
}