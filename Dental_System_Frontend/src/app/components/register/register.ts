import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  registerForm: FormGroup; 

  
  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]], 
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]] 
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

   
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Registration Success!', response);
        alert('Registration Successful! Redirecting to login...');
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.error('Registration Failed!', err);
        alert('Registration Failed! Email might already exist.');
      }
    });
  }
}
