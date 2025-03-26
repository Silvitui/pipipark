import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

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

  logout(): void {
    this.authService.logout();
    this.showMenu = false;
  }
}
