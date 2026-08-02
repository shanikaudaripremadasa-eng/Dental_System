import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:5000/api/notifications'; 

  
  private unreadCount = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCount.asObservable();

  constructor(private http: HttpClient) {}

  
  updateUnreadCount(count: number) {
    this.unreadCount.next(count);
  }

  getNotifications(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}`, {});
  }
}