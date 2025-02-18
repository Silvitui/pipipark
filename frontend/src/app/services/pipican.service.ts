import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pipican } from '../interfaces/Pipican';



@Injectable({
  providedIn: 'root',
})
export class PipicanService {
  apiUrl = 'http://localhost:3000/api/pipicans'; 
  http = inject(HttpClient);
  selectedPipican = signal<any>(null);

  getPipicans(): Observable<Pipican[]> {
    return this.http.get<Pipican[]>(this.apiUrl);
  }
  setSelectedPipican(pipican: any) {
    this.selectedPipican.set(pipican);
  }

  // Método para limpiar el pipican seleccionado
  clearSelectedPipican() {
    this.selectedPipican.set(null);
  }
}

