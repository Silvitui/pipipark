// user.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { ChangePasswordDTO } from '../interfaces/password.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   http = inject(HttpClient);
   apiUrl = 'http://localhost:3000/api/users/profile';
   passwordUrl = 'http://localhost:3000/api/users/changePassword';

  user = signal<User | null>(null);
  fetchUserOnly(): void {
    this.loadUserProfile().subscribe({
      next: (res) => {
        this.user.set(res.user);
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.clearUser();
      }
    });
  }
  
  loadUserProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(this.apiUrl, { withCredentials: true });
  }

  updateProfile(data: Partial<User>): Observable<{ user: User }> {
    return this.http.put<{ user: User }>(this.apiUrl, data, { withCredentials: true });
  }

  changePassword(data: ChangePasswordDTO) {
    return this.http.post<{ message: string }>(this.passwordUrl, data, { withCredentials: true });
  }

  getUser(): User | null {
    return this.user();
  }

  setUser(user: User | null) {
    this.user.set(user);
  }

  clearUser() {
    this.user.set(null);
  }
}
