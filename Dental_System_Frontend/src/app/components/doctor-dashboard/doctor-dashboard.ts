import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment'; 

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboardComponent implements OnInit {
  
  doctorStats: any = { todayAppointments: 0, totalTreated: 0, pendingApprovals: 0 };
  doctorAppointments: any[] = [];
  currentDoctorId: string = '';
  currentDoctorName: string = ''; 
  showNoteModal: boolean = false;
  selectedAppointment: any = null;
  treatmentNotes: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.initializeDoctorData();
  }

  initializeDoctorData(): void {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentDoctorId = user._id || user.id || '';
      this.currentDoctorName = user.fullName || user.name || ''; 
      this.loadDoctorDashboardData();
    } else {
      this.router.navigate(['/login']);
    }
  }

loadDoctorDashboardData(): void {
    if (!this.currentDoctorId) return;

    this.appointmentService.getDoctorAppointments(this.currentDoctorId).subscribe({
      next: (res: any) => {
        console.log("Backend response:", res);

       
        const rawAppointments = res.appointments ? res.appointments : (Array.isArray(res) ? res : []);
        
       
        this.doctorStats = {
            todayAppointments: rawAppointments.filter((a: any) => a.status === 'Pending').length,
            totalTreated: rawAppointments.filter((a: any) => a.status === 'Completed').length,
            pendingApprovals: rawAppointments.filter((a: any) => a.status === 'Pending').length
        };

        this.doctorAppointments = rawAppointments.map((app: any) => {
          return {
            ...app,
            patientDisplayName: app.patient?.fullName || app.patient?.name || app.patientName || 'Unknown'
          };
        });

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching dashboard data:', err)
    });
}
  
  updateStatus(appointmentId: string, newStatus: string): void {
    this.appointmentService.updateAppointment(appointmentId, { status: newStatus }).subscribe({
      next: () => this.loadDoctorDashboardData(),
      error: (err) => console.error('Error updating status:', err)
    });
  }

  openNoteModal(appointment: any): void {
    this.selectedAppointment = appointment;
    this.treatmentNotes = ''; 
    this.showNoteModal = true;
  }

  closeNoteModal(): void {
    this.showNoteModal = false;
    this.selectedAppointment = null;
    this.treatmentNotes = '';
  }

  submitTreatmentAndComplete(): void {
    if (!this.selectedAppointment) return;
    this.appointmentService.updateAppointment(this.selectedAppointment._id, { status: 'Completed', notes: this.treatmentNotes || 'No notes added.' }).subscribe({
      next: () => {
        this.closeNoteModal();
        this.loadDoctorDashboardData(); 
      },
      error: (err) => console.error('Error completing:', err)
    });
  }

  logout(): void {
    localStorage.clear(); 
    this.router.navigate(['/login']); 
  }
}