import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dog } from '../interfaces/dog.interface';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private http = inject(HttpClient);
 apiUrl = 'http://localhost:3000/api'; // 👈 puedes cambiarlo a environment.apiUrl más adelante

  /**
   * Sube una imagen para el perro con ID dado.
   * @param dogId ID del perro
   * @param formData FormData que contiene la imagen (clave: 'image')
   * @returns Observable con la nueva URL de la imagen
   */
  updateDog(dogId: string, data: Partial<Dog>): Observable<{ dog: Dog }> {
    return this.http.put<{ dog: Dog }>(
      `${this.apiUrl}/dogs/${dogId}`,
      data,
      { withCredentials: true }
    );
  }
  
  uploadDogPhoto(dogId: string, formData: FormData): Observable<{ photo: string }> {
    return this.http.post<{ photo: string }>(
      `${this.apiUrl}/dogs/upload-photo/${dogId}`,
      formData,
      { withCredentials: true }
    );
  }
  
  // Aquí puedes añadir otros métodos como:
  // getMyDogs(), addDog(), deleteDog(), etc.
}
