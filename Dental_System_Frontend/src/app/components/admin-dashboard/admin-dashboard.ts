import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { AppointmentService } from '../../services/appointment'; 

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-dashboard.html', 
  styleUrl: './admin-dashboard.css'       
})
export class AdminDashboardComponent implements OnInit {
  
  stats: any = {
    totalPatients: 0,
    totalDentists: 0,
    totalAppointments: 0,
    monthlyRevenue: 0
  };

  recentAppointments: any[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.loadAdminDashboardStats();
    this.loadRecentAppointments();
  }

  loadAdminDashboardStats(): void {
    this.appointmentService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        console.log('Admin Dashboard Stats loaded successfully! 📊', this.stats);
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error loading admin dashboard stats ❌:', err);
      }
    });
  }

  loadRecentAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data)) {
          this.recentAppointments = data.slice(-4).reverse(); 
        } else {
          this.recentAppointments = [];
        }
          console.log('Admin Recent appointments loaded! 📝', this.recentAppointments);
          this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading recent appointments ❌:', err);
      }
    });
  }

  
  logout(): void {
   
    localStorage.clear(); 
    
    console.log('User logged out successfully! 🚪👋');
    
    
    this.router.navigate(['/login']); 
  }
}