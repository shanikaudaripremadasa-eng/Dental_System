import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-book-appointment',
  imports: [FormsModule], 
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css'
})
export class BookAppointmentComponent {
  
 
  appointmentData = {
    doctor: '',
    date: '',
    time: '',
    notes: ''
  };

  onSubmit() {
    console.log('Captured Data:', this.appointmentData);
    alert('Appointment Form Submitted! Data caught successfully.');
  }
}
