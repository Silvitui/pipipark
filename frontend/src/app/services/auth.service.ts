import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
   apiUrl = 'http://localhost:3000/api/auth'; 

  public isAuthenticated = signal<boolean>(false);
 ngOnInit() {
    this.checkAuthStatus();  
  }
  checkAuthStatus(): void {
    this.http.get<{ authenticated: boolean }>(`${this.apiUrl}/check-auth`, { withCredentials: true })
      .pipe(
        tap(response => this.isAuthenticated.set(response.authenticated)),
        catchError(() => {
          this.isAuthenticated.set(false);
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
      tap(() => this.isAuthenticated.set(true))
    );
  }
  

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.isAuthenticated.set(false);  
      this.router.navigate(['/welcome']);
    });
  }
}
