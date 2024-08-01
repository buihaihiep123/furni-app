import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  userForm: FormGroup;
  userId: number | undefined;
  user: any = null; 
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      account_name: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.userId = id ? Number(id) : undefined;

    if (this.userId === undefined || isNaN(this.userId)) {
      // Xử lý nếu userId không hợp lệ
      console.error('Invalid user ID');
      this.router.navigate(['/home']);
      return;
    }

    this.userService.getUserById(this.userId).subscribe(data => {
      this.user = data; // Gán giá trị cho user
      this.userForm.patchValue(data);
    });
  }

  onSubmit(): void {
    if (this.userForm.valid && this.userId !== undefined) {
      const updatedUser = {
        ...this.userForm.value,
        account_id: this.userId
      };
      this.userService.updateUser(updatedUser).subscribe(
        response => {
          alert('Cập nhật thành công!');
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error updating user:', error);
          alert('Cập nhật thất bại!');
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}