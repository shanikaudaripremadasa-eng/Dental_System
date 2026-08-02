import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http'; 
import { AppointmentService } from '../../services/appointment'; 

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, HttpClientModule], 
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css'
})
export class MyAppointmentsComponent implements OnInit {
  appointments: any[] = []; 
  currentPatientId: string = ''; 

  constructor(
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef 
  ) { }

ngOnInit(): void {
    
    let id = localStorage.getItem('patientId') || localStorage.getItem('doctorId');
    
    if (!id) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
           
            id = user._id || user.id || '';
        }
    }

    this.currentPatientId = id || '';
    console.log("Logged in User ID: ", this.currentPatientId);
    
    if (this.currentPatientId) {
        this.loadAppointments(); 
    }
}
 
loadAppointments(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role; 

    if (role === 'doctor') {
       
        this.appointmentService.getDoctorAppointments(this.currentPatientId).subscribe({
            next: (res: any) => {
                this.appointments = Array.isArray(res) ? res : (res.appointments || []);
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading doctor appointments:', err)
        });
    } else {
       
        this.appointmentService.getPatientAppointments(this.currentPatientId).subscribe({
            next: (res: any) => {
              console.log("Full Appointment Data Received:", res);
                this.appointments = Array.isArray(res) ? res : (res.appointments || []);
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading patient appointments:', err)
        });
    }
}

  cancelAppointment(id: string): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.updateAppointment(id, { status: 'Cancelled' }).subscribe({
        next: () => {
          alert('Appointment status updated to Cancelled! ❌');
          this.loadAppointments(); 
        },
        error: (err) => {
          console.error('Error cancelling appointment:', err);
          alert('Failed to cancel appointment.');
        }
      });
    }
  }
}