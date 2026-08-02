import { Routes } from '@angular/router'; 
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard';
import { BookAppointmentComponent } from './components/book-appointment/book-appointment';
import { MyAppointmentsComponent } from './components/my-appointments/my-appointments';
import { MessagesComponent } from './components/messages/messages';
import { NotificationsComponent } from './components/notifications/notifications';
import { ReportsComponent } from './components/reports/reports';

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard';
import { AddDoctor } from './components/add-doctor/add-doctor';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    
    
    { 
      path: 'admin-dashboard', 
      component: AdminDashboardComponent, 
      canActivate: [authGuard], 
      data: { roles: ['admin'] } 
    },   
    { 
      path: 'add-doctor', 
      component: AddDoctor, 
      canActivate: [authGuard], 
      data: { roles: ['admin'] } 
    },

    
    { 
      path: 'doctor-dashboard', 
      component: DoctorDashboardComponent, 
      canActivate: [authGuard], 
      data: { roles: ['doctor'] } 
    }, 
    
    
    { 
      path: 'patient-dashboard', 
      component: PatientDashboardComponent, 
      canActivate: [authGuard], 
      data: { roles: ['patient'] } 
    }, 
    { 
      path: 'book-appointment', 
      component: BookAppointmentComponent, 
      canActivate: [authGuard], 
      data: { roles: ['patient'] } 
    },
    
   
    { 
      path: 'my-appointments', 
      component: MyAppointmentsComponent, 
      canActivate: [authGuard], 
      data: { roles: ['patient', 'doctor'] } 
    },
    { 
      path: 'messages', 
      component: MessagesComponent, 
      canActivate: [authGuard], 
      data: { roles: ['admin', 'doctor', 'patient'] } 
    },
    { 
      path: 'notifications', 
      component: NotificationsComponent, 
      canActivate: [authGuard], 
      data: { roles: ['admin', 'doctor', 'patient'] } 
    },
    { 
      path: 'reports', 
      component: ReportsComponent, 
      canActivate: [authGuard], 
      data: { roles: ['admin', 'patient', 'doctor'] } 
    }
];