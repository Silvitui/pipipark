import { UserDogService } from './../../services/user-dog.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports: [CommonModule]
})
export class WelcomeComponent implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);
  userService = inject(UserService);
  UserDogService = inject(UserDogService);

  showMobileMenu = false;

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.userService.fetchUserOnly();
    }
  }
  
  goToLogin(): void {
    this.router.navigate(['/login']);
    this.showMobileMenu = false;
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
    this.showMobileMenu = true;
  }

  goToMap(): void {
    this.router.navigate(['/map']);
    this.showMobileMenu = true;
  }

  logout(): void {
    this.authService.logout();
    this.showMobileMenu = true;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
