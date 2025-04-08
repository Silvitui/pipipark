import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pipican } from '../interfaces/pipican';
import { Dog } from '../interfaces/dog.interface';
import { ParkVisitType } from '../interfaces/parkVisitType';


@Injectable({
  providedIn: 'root',
})
export class PipicanService {
  apiUrl = 'http://localhost:3000/api/pipicans'; 
  parkUrl = 'http://localhost:3000/api/parks';
  http = inject(HttpClient);
  selectedPipican = signal<any>(null);

  getPipicans(): Observable<Pipican[]> {
    return this.http.get<Pipican[]>(this.apiUrl, {
      withCredentials: true
    });
  }
  
  setSelectedPipican(pipican: any) {
    this.selectedPipican.set(pipican);
  }
  clearSelectedPipican() {
    this.selectedPipican.set(null);
  }
  getDogsInPipican(parkId: string) {
    return this.http.get<{ parkId: string; dogsInPark: ParkVisitType[] }>(
      `${this.parkUrl}/${parkId}`,
      { withCredentials: true }
    );
  }
  
  checkIn(parkId: string, dogIds: string[]) {
    return this.http.post(`${this.parkUrl}/checkin`, { parkId, dogIds }, { withCredentials: true });
  }
  
  checkOut(parkId: string) {
    return this.http.post(`${this.parkUrl}/checkout`, { parkId }, { withCredentials: true });
  }
  


}

