import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-notifications',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  private socket: any; 

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef 
  ) {
    this.socket = (io as any)('http://localhost:5000');
  }

ngOnInit(): void {
  
    
    this.loadNotifications();

    
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.socket.emit('join', userId.trim()); 
      console.log('Joined socket room for user:', userId.trim());
    }

    
    this.socket.on('newNotification', (data: any) => {
      console.log('New notification received from backend:', data);

      if (data) {
        this.notifications.unshift(data);
        this.updateUnreadCount();         
        this.cdr.detectChanges();         
      }
    });
  }
  
  private updateUnreadCount(): void {
    const unreadCount = this.notifications.filter(n => !n.isRead).length;
    this.notificationService.updateUnreadCount(unreadCount);
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

loadNotifications(): void {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : {};
    
   
    let rawId = localStorage.getItem('patientId') || 
                localStorage.getItem('doctorId') || 
                user.id || user._id;

    if (rawId) {
       
        const userId = String(rawId).trim();
        
        console.log("Loading notifications for User ID:", userId);
        
        this.notificationService.getNotifications(userId).subscribe({
            next: (data: any) => {
                this.notifications = Array.isArray(data) ? data : [];
                this.updateUnreadCount();
                this.cdr.detectChanges(); 
            },
            error: (err) => {
                console.error('API Error while loading notifications:', err);
            }
        });
    } else {
        console.log("No valid user ID found in LocalStorage.");
    }
}
  markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        
        const index = this.notifications.findIndex(n => n._id === id);
        if (index > -1) {
          this.notifications[index].isRead = true;
        }
        
       
        this.updateUnreadCount();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error marking as read:', err)
    });
  }
}