import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authService = inject(AuthService);
   router = inject(Router);

  email = signal<string>('');
  password = signal<string>('');
  errorMessage = signal<string>('');

 
  login(): void {
    const credentials = { email: this.email(), password: this.password() };
    this.authService.loginUser(credentials).subscribe({
      next: () => {
        this.router.navigate(['/welcome']); 
      },
      error: (err) => {
        this.errorMessage.set(" Email o contraseña incorrectos ");
        console.error("Error en el login:", err);
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
