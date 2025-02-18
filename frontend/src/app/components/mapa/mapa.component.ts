import { Component, AfterViewInit, inject, signal, effect } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { PipicanService } from '../../services/pipican.service';
import { Pipican } from '../../interfaces/Pipican';
import { environment } from '../../../environment';
import { ModalComponent } from "../../modal/modal.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  imports: [CommonModule, FormsModule, ModalComponent],
  standalone: true // Si estás usando Angular 17+ con standalone components
})
export class MapaComponent implements AfterViewInit {
  map!: mapboxgl.Map;
  pipicanService = inject(PipicanService);

  // Signal para manejar el estado del modal
  selectedPipican = signal<{ name: string; barrio: string } | null>(null);

  // Variables para el buscador
  searchTerm: string = '';
  allPipicans: Pipican[] = [];

  ngAfterViewInit(): void {
    this.initializeMap();
    this.loadPipicans();
  }

  initializeMap(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2.1763, 41.3879],
      zoom: 12.8,
      accessToken: environment.mapboxToken
    });

    this.map.on('load', () => {
      console.log('Mapa cargado');
    });
  }

  loadPipicans(): void {
    this.pipicanService.getPipicans().subscribe({
      next: (pipicans: Pipican[]) => {
        console.log('Pipicans cargados:', pipicans);
        this.allPipicans = pipicans;
        pipicans.forEach((pipican) => this.addMarker(pipican));
      },
      error: (err) => {
        console.error('Error loading pipicans:', err);
      }
    });
  }

  addMarker(pipican: Pipican): void {
    const dogMarkerElement = document.createElement('div');
    dogMarkerElement.className = 'dog-marker';
    dogMarkerElement.style.backgroundImage = 'url(assets/dog-icon.png)';
    dogMarkerElement.style.width = '32px';
    dogMarkerElement.style.height = '32px';
    dogMarkerElement.style.backgroundSize = 'contain';
    dogMarkerElement.style.cursor = 'pointer'; // Cambiado a 'pointer' para indicar que es clickeable

    new mapboxgl.Marker(dogMarkerElement)
      .setLngLat(pipican.coords)
      .addTo(this.map)
      .getElement()
      .addEventListener('click', () => {
        this.selectedPipican.set({ name: pipican.name ?? '', barrio: pipican.barrio ?? '' });
      });
  }
  filteredPipicans(): Pipican[] {
    if (!this.searchTerm.trim()) {
      return this.allPipicans;
    }
  
    const searchTermLower = this.searchTerm.toLowerCase();
  
    // Filtra los Pipican que coinciden con el término de búsqueda
    const filtered = this.allPipicans.filter((pipican) =>
      (pipican.name ?? '').toLowerCase().includes(searchTermLower) ||
      (pipican.barrio ?? '').toLowerCase().includes(searchTermLower)
    );
  
    // Si hay menos de 5 resultados, devuelve todos
    if (filtered.length <= 5) {
      return filtered;
    }
  
    // Devuelve los 5 primeros
    const firstFive = filtered.slice(0, 5);
  
    // Encuentra el que más se parece al término de búsqueda
    const bestMatch = filtered.find((pipican) =>
      (pipican.name ?? '').toLowerCase() === searchTermLower ||
      (pipican.barrio ?? '').toLowerCase() === searchTermLower
    );
  
    // Si hay un mejor match y no está en los primeros 5, lo añade
    if (bestMatch && !firstFive.includes(bestMatch)) {
      firstFive.push(bestMatch);
    }
  
    return firstFive;
  }
  goToPipican(pipican: Pipican): void {
    this.map.flyTo({ center: pipican.coords, zoom: 15 });
    this.selectedPipican.set({ name: pipican.name ?? '', barrio: pipican.barrio ?? '' });
  }
}