import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dog } from '../interfaces/dog.interface';

@Injectable({
  providedIn: 'root'
})
export class DogService {
 http = inject(HttpClient);
 apiUrl = 'http://localhost:3000/api'; 

  /**
   * Sube una imagen para el perro con ID dado.
   * @param dogId 
   * @param formData 
   * @returns 
   */
  updateDog(dogId: string, data: Partial<Dog>): Observable<{ dog: Dog }> {
    return this.http.put<{ dog: Dog }>(
      `${this.apiUrl}/dogs/${dogId}`,
      data,
      { withCredentials: true }
    );
  }
  addDog(data: Partial<Dog>): Observable<{ dog: Dog }> {
    return this.http.post<{ dog: Dog }>(
      `${this.apiUrl}/dogs`,
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
  deleteDog(dogId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/dogs/${dogId}`,
      { withCredentials: true }
    );
  }
  
  

}
