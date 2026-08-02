import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth'; 

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './add-doctor.html', 
  styleUrl: './add-doctor.css',
})
export class AddDoctor { 
  doctorForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    
    this.doctorForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      specialization: ['General'], 
      phone: ['']                  
    });
  }

  onSubmit() {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    
    this.authService.addDoctor(this.doctorForm.value).subscribe({
      next: (res) => {
        alert('Doctor Registered Successfully by Admin! 🩺✅');
        this.doctorForm.reset({ specialization: 'General' }); 
      },
      error: (err) => {
        console.error(err);
        alert(err.error.message || 'Failed to add doctor!');
      }
    });
  }
}