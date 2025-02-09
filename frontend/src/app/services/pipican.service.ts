import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pipican } from '../interfaces/Pipican';



@Injectable({
  providedIn: 'root',
})
export class PipicanService {
  apiUrl = 'http://localhost:3000/api/pipicans'; 
  http = inject(HttpClient);

  getPipicans(): Observable<Pipican[]> {
    return this.http.get<Pipican[]>(this.apiUrl);
  }
}

