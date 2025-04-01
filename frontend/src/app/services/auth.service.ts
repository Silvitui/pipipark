import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
   apiUrl = 'http://localhost:3000/api/auth'; 
   user = signal<User | null>(null);

   isAuthenticated = computed(() => this.user() !== null);
 ngOnInit() {
    this.checkAuthStatus();  
  }
  checkAuthStatus(): void {
    this.http.get<{ authenticated: boolean, user?: User }>(`${this.apiUrl}/check-auth`, { withCredentials: true })
      .pipe(
        tap(response => {
          this.user.set(response.authenticated ? response.user ?? null : null);
        }),
        catchError(() => {
          this.user.set(null);
          return of(null);
        })
      )
      .subscribe();
  }
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, { withCredentials: true });
  }
  
  loginUser(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((res: any) => {
        this.user.set(res.user); 
      })
    );
  }
  

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.user.set(null);  
      this.router.navigate(['/welcome']);
    });
  }
}
