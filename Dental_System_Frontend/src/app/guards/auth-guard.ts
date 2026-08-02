import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); 
  const savedUser = localStorage.getItem('user');

  if (savedUser) {
    const user = JSON.parse(savedUser);
    const userRole = user.role ? user.role.toLowerCase() : 'patient';

    
    const expectedRoles = route.data['roles'] as Array<string>;

    
    if (!expectedRoles || expectedRoles.map(r => r.toLowerCase()).includes(userRole)) {
      return true;
    }

    console.warn('Access denied! Redirecting to dashboard... ⛔');
    if (userRole === 'admin') {
      router.navigate(['/admin-dashboard']);
    } else if (userRole === 'doctor') {
      router.navigate(['/doctor-dashboard']);
    } else {
      router.navigate(['/patient-dashboard']);
    }
    return false;
  }

 
  console.warn('Not logged in! Redirecting to login... 🔑');
  router.navigate(['/login']);
  return false;
};