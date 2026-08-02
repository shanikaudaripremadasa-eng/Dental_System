import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup; 

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private authService: AuthService 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]] 
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); 
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log('Login Success! Full Response:', response);
        alert('Login Successful!');

        const userObj = response.user || response;
        
        
        localStorage.clear(); 

       
        localStorage.setItem('user', JSON.stringify(userObj));
        const userId = userObj._id || userObj.id || response.userId;
        
        
        let userRole = 'patient';
        if (response.role) {
          userRole = response.role.toLowerCase();
        } else if (userObj && userObj.role) {
          userRole = userObj.role.toLowerCase();
        }

       
        if (userRole === 'doctor') {
            localStorage.setItem('doctorId', response.doctorId || userId); 
        } else if (userRole === 'patient') {
            localStorage.setItem('patientId', userId);
        }

        console.log('Dynamic Role Detected:', userRole);
        
        
        if (userRole === 'admin') {
          this.router.navigate(['/admin-dashboard']); 
        } else if (userRole === 'doctor') {
          this.router.navigate(['/doctor-dashboard']); 
        } else {
          this.router.navigate(['/patient-dashboard']); 
        }
      },
      error: (err) => {
        console.error('Login Failed!', err);
        alert('Login Failed! Please check your email and password.'); 
      }
    });
  }
}