import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-mobile-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-sidebar.component.html'
})
export class MobileSidebarComponent {
  showMenu = false;
  router = inject(Router);
  authService = inject(AuthService);


  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  navigate(path: string): void {
    this.router.navigate([path]);
    this.showMenu = false;
  }
  goToProfile(): void {
    this.router.navigate(['/profile']);
    this.showMenu = false;
    
  }
  goToHome(): void {
    this.router.navigate(['/welcome']);
    this.showMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.showMenu = false;
  }
}
