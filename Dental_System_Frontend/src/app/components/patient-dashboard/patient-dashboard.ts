import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router'; 
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink], 
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css'
})
export class PatientDashboardComponent implements OnInit {

 
  stats: any = {
    totalAppointments: 0,
    pendingCount: 0 
  };

  recentAppointments: any[] = [];
  latestDoctorNote: any = null; 
  currentPatientId: string = '';

  currentDate: Date = new Date();
  currentMonthName: string = '';
  calendarDays: any[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef,
    private router: Router 
  ) { }

  ngOnInit(): void {
    
    const patientId = localStorage.getItem('patientId');
    if (patientId) {
      this.currentPatientId = patientId;
      console.log("Logged in Patient ID is: ", this.currentPatientId);
    }

    this.loadDashboardStats();
    this.loadRecentAppointments();
    this.generateCalendar(); 
  }

  loadDashboardStats(): void {
    if (!this.currentPatientId) return;

    this.appointmentService.getPatientStats(this.currentPatientId).subscribe({
      next: (data) => {
        
        this.stats = {
          totalAppointments: data.totalAppointments || 0,
          pendingCount: data.pendingCount || 0
        };
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      }
    });
  }

  loadRecentAppointments(): void {
    if (!this.currentPatientId) return;

    this.appointmentService.getPatientAppointments(this.currentPatientId).subscribe({
      next: (res: any) => {
        const appointmentsList = Array.isArray(res) ? res : (res.appointments || []);
        
        if (Array.isArray(appointmentsList)) {
          this.recentAppointments = [...appointmentsList].reverse().slice(0, 3); 

          const appointmentWithNote = appointmentsList
            .slice() 
            .reverse() 
            .find(app => app.notes && app.notes.trim() !== ''); 

          if (appointmentWithNote) {
            this.latestDoctorNote = {
              doctorName: appointmentWithNote.doctor?.name || 'Dr. Perera',
              notes: appointmentWithNote.notes,
              time: appointmentWithNote.time || 'N/A'
            };
          }
        }
        this.cdr.detectChanges();
      }
    });
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.currentMonthName = this.currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevDaysTotal = new Date(year, month, 0).getDate();

    this.calendarDays = [];
    for (let i = firstDayIndex; i > 0; i--) {
      this.calendarDays.push({ day: prevDaysTotal - i + 1, isCurrentMonth: false, isToday: false });
    }
    const today = new Date();
    for (let i = 1; i <= totalDays; i++) {
      const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;
      this.calendarDays.push({ day: i, isCurrentMonth: true, isToday: isToday });
    }
    this.cdr.detectChanges();
  }

  prevMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  logout(): void {
    localStorage.clear(); 
    this.router.navigate(['/login']); 
  }
}