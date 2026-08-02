import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms'; 
import { NotificationService } from './services/notification.service'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'DentalSystemFrontend';
  currentUrl = '';
  unreadCount$: Observable<number>;

  constructor(private router: Router, private notificationService: NotificationService) {
    this.unreadCount$ = this.notificationService.unreadCount$; 

    this.currentUrl = this.router.url;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
    });
  }

  isAuthPage(): boolean {
    return this.currentUrl.includes('login') || this.currentUrl.includes('register') || this.currentUrl === '/';
  }

  getUserRole(): string {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.role ? user.role.toLowerCase() : 'patient'; 
    }
    if (this.currentUrl.includes('admin-dashboard')) return 'admin';
    if (this.currentUrl.includes('doctor-dashboard')) return 'doctor';
    return 'patient'; 
  }

  getUserName(): string {
    if (this.currentUrl.includes('admin-dashboard')) return 'System Admin';
    if (this.currentUrl.includes('doctor-dashboard')) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        return user.name || user.fullName || 'Doctor'; 
      }
      return 'Doctor';
    }
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.name || user.fullName || 'Patient';
    }
    return 'Guest User'; 
  }
}