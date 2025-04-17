import { Component, AfterViewInit, inject, signal, effect } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { PipicanService } from '../../services/pipican.service';
import { Pipican } from '../../interfaces/pipican';
import { ModalComponent } from "../modal/modal.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  imports: [CommonModule, FormsModule, ModalComponent],
  standalone: true 
})
export class MapaComponent implements AfterViewInit {
  map!: mapboxgl.Map;
  pipicanService = inject(PipicanService);
  selectedPipican = signal<{ name: string; barrio: string; _id: string } | null>(null);
  searchTerm: string = '';
  allPipicans: Pipican[] = [];
  showSearchBar: boolean = false;
  showResults: boolean = false;

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
    dogMarkerElement.style.cursor = 'pointer'; 

    new mapboxgl.Marker(dogMarkerElement)
      .setLngLat(pipican.coords)
      .addTo(this.map)
      .getElement()
      .addEventListener('click', () => {
        this.selectedPipican.set({
          name: pipican.name ?? '',
          barrio: pipican.barrio ?? '',
          _id: pipican._id
        });
      });
  }

  filteredPipicans(): Pipican[] {
    if (!this.searchTerm.trim()) {
      return [];
    }
  
    const searchTermLower = this.searchTerm.toLowerCase();
    return this.allPipicans
      .filter((pipican) =>
        (pipican.name ?? '').toLowerCase().includes(searchTermLower) ||
        (pipican.barrio ?? '').toLowerCase().includes(searchTermLower)
      )
      .slice(0, 5);
  }

  goToPipican(pipican: Pipican): void {
    this.map.flyTo({ 
      center: pipican.coords, 
      zoom: 15,
      essential: true
    });
    this.selectedPipican.set({
      name: pipican.name ?? '',
      barrio: pipican.barrio ?? '',
      _id: pipican._id
    });
    this.showResults = false;
    this.showSearchBar = false;
  }

  toggleSearch(): void {
    this.showSearchBar = !this.showSearchBar;
    this.showResults = this.showSearchBar && this.searchTerm.trim() !== '';
  }
}