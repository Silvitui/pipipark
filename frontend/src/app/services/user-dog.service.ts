import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dog } from '../interfaces/dog.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDogService {
   apiUrl = 'http://localhost:3000/api';
  http = inject(HttpClient);

  dogs = signal<Dog[]>([]);

 
  dogNames = computed(() => {
    const names = this.dogs().map(d => d.name);

    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} y ${names[1]}`;

    const last = names.pop();
    return `${names.join(', ')} y ${last}`;
  });


  loadUserDogs(): Observable<{ dogs: Dog[] }> {
    return this.http.get<{ dogs: Dog[] }>(`${this.apiUrl}/dogs/mine`, {
      withCredentials: true
    });
  }


  fetchAndSetUserDogs(): void {
    this.loadUserDogs().subscribe({
      next: (res) => this.dogs.set(res.dogs),
      error: (err) => {
        console.error('Error al obtener los perros del usuario:', err);
        this.dogs.set([]);
      }
    });
  }

  getDogs(): Dog[] {
    return this.dogs();
  }

  clearDogs(): void {
    this.dogs.set([]);
  }
}
