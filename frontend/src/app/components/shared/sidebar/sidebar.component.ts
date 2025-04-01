import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isOpen = signal(true); 
  router = inject(Router);
  authService = inject(AuthService);

  toggleSidebar() {
    this.isOpen.set(!this.isOpen());
  }

  closeSidebarOnMobile() {
    this.isOpen.set(false);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
    this.closeSidebarOnMobile();
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
    this.closeSidebarOnMobile();
  }

  goToMap(): void {
    this.router.navigate(['/map']);
    this.closeSidebarOnMobile();
  }

  logout(): void {
    this.authService.logout();
    
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
    this.closeSidebarOnMobile();
  }

  goToHome() : void {
    this.router.navigate(['/welcome']);
    this.closeSidebarOnMobile();
  }
}
