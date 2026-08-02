import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:5000/api/appointments'; 

  constructor(private http: HttpClient) { }

  bookAppointment(appointmentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/book`, appointmentData);
  }

  getAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getPatientAppointments(patientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/${patientId}`);
  }

  updateAppointment(id: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, updatedData);
  }

  deleteAppointment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5000/api/doctors/all');
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard-stats`);
  }

  getDoctorAppointments(doctorId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctor/${doctorId}`);
  }

  
  getPatientStats(patientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient-stats/${patientId}`);
  }
}