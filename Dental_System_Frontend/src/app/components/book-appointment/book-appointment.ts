import { Component, OnInit } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http'; 
import { Router } from '@angular/router'; 
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule], 
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css'
})
export class BookAppointmentComponent implements OnInit {
 
  doctorsList: any[] = [];

  appointmentData = {
    patient: '', 
    doctor: '',
    date: '',  
    time: '',  
    notes: ''
  };

  constructor(
    private appointmentService: AppointmentService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.appointmentData.patient = user._id || user.id || '';
      console.log('Logged in Patient ID loaded successfully! ✅', this.appointmentData.patient);
    }

    if (!this.appointmentData.patient) {
      const savedPatientId = localStorage.getItem('patientId');
      if (savedPatientId) {
        this.appointmentData.patient = savedPatientId;
      } else {
        console.warn('No logged in patient found in localStorage! ⚠️');
      }
    }
  }

  loadDoctors(): void {
    this.appointmentService.getDoctors().subscribe({
      next: (data) => {
        this.doctorsList = data;
        console.log('Doctors loaded from MongoDB successfully! ✅', this.doctorsList);
      },
      error: (err) => {
        console.error('Error loading doctors ❌:', err);
      }
    });
  }

  onSubmit() {
    if (!this.appointmentData.patient) {
      alert('Please login first to book an appointment!');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.appointmentData.doctor) {
      alert('Please select a doctor!');
      return;
    }

  
    const combinedData = {
      patient: this.appointmentData.patient,
      doctor: this.appointmentData.doctor, 
      appointmentDate: this.appointmentData.date, 
      time: this.appointmentData.time,            
      notes: this.appointmentData.notes
    };

    console.log('Sending to backend:', combinedData);

    this.appointmentService.bookAppointment(combinedData).subscribe({
      next: (response: any) => { 
        console.log('Success:', response);
        alert('Appointment Booked Successfully in MongoDB! 🎉');
        
        this.appointmentData.doctor = '';
        this.appointmentData.date = '';
        this.appointmentData.time = '';
        this.appointmentData.notes = '';

        this.router.navigate(['/patient-dashboard']);
      },
      error: (err: any) => {
        console.error('Error:', err);
        alert('Failed to book appointment. Check if Backend is running.');
      }
    });
  }
}