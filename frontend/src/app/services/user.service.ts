import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Dog } from '../interfaces/dog.interface';
import { ChangePasswordDTO } from '../interfaces/password.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'http://localhost:3000/api';
  userProfileUrl = `${this.apiUrl}/users/profile`;
  userDogsUrl = `${this.apiUrl}/dogs/mine`;
  http = inject(HttpClient);

  user = signal<User | null>(null);
  dogs = signal<Dog[]>([]);

  loadUserProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(this.userProfileUrl, {
      withCredentials: true
    });
  }

  loadUserDogs(): Observable<{ dogs: Dog[] }> {
    return this.http.get<{ dogs: Dog[] }>(this.userDogsUrl, {
      withCredentials: true
    });
  }

  fetchAndSetUser(): void {
    this.loadUserProfile().subscribe({
      next: (res) => {
        this.user.set(res.user);

        this.loadUserDogs().subscribe({
          next: (dogRes) => {
            this.dogs.set(dogRes.dogs || []);
          },
          error: (err) => {
            console.error(' Error al obtener los perros:', err);
            this.dogs.set([]);
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        this.user.set(null);
        this.dogs.set([]);
      }
    });
  }

  getUser(): User | null {
    return this.user();
  }

  getDogs(): Dog[] {
    return this.dogs();
  }

  public dogNames = computed(() => {
    const dogs = this.dogs();
    const names = dogs.map(d => d.name);

    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} y ${names[1]}`;

    const last = names.pop();
    return `${names.join(', ')} y ${last}`;
  });

  updateProfile(data: Partial<User>): Observable<{ user: User }> {
    return this.http.put<{ user: User }>(this.userProfileUrl, data, {
      withCredentials: true
    });
  }
  changePassword(data: ChangePasswordDTO) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/users/change-password`,
      data,
      { withCredentials: true }
    );
  }
  
}
