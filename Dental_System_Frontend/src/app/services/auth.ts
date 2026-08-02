import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/api/auth'; 

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginData).pipe(
      tap((res: any) => {
      
        const userObj = res.user || res;
        const id = userObj._id || userObj.id || res.userId;
        const role = userObj.role;
        if (id) {
          localStorage.setItem('userId', id);
          console.log("AuthService: User ID saved ->", id);
        }
        if (role) {
        localStorage.setItem('userRole', role);
        console.log("AuthService: Role saved ->", role);
      }
if (userObj.patientId) localStorage.setItem('patientId', userObj.patientId);
      if (userObj.doctorId) localStorage.setItem('doctorId', userObj.doctorId);

      })
    );
  }

  getUserId(): string | null {
   
    return localStorage.getItem('userId') || 
           localStorage.getItem('patientId') || 
           localStorage.getItem('doctorId');
  }

  addDoctor(doctorData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-doctor`, doctorData);
  }
}