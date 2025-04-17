import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompatibilityRequest, CompatibilityResponse } from '../interfaces/dog.interface';


@Injectable({
  providedIn: 'root',
})
export class CompatibilityService {
  apiUrl = 'http://localhost:3000/api/compatibility';
  http  = inject(HttpClient);

  checkCompatibility(data: CompatibilityRequest): Observable<CompatibilityResponse> {
    return this.http.post<CompatibilityResponse>(
      `${this.apiUrl}/check`,
      data,
      {
        withCredentials: true 
      }
    );
  }
}
