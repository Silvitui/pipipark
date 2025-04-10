import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompatibilityService {
 apiUrl = 'http://localhost:3000/api/compatibility';
http = inject(HttpClient);

  checkCompatibility(data: {
    myDog: { name: string; personality: string },
    otherDogs: { name: string; personality: string }[],
    parkId: string
  }): Observable<{ results: { name: string; compatibility: number }[] }> {
    return this.http.post<{ results: { name: string; compatibility: number }[] }>(
      this.apiUrl,
      data,
      { withCredentials: true } 
    );
  }
}
