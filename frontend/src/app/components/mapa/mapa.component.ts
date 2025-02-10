import { Component, AfterViewInit, inject } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environment';
import { PipicanService } from '../../services/pipican.service';
import { Pipican } from '../../interfaces/Pipican';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit {
  map!: mapboxgl.Map;
  pipicanService = inject(PipicanService)

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2.1763, 41.3879], 
      zoom: 12.8,
      accessToken: environment.mapboxToken
    });

    this.map.on('load', () => {
      this.loadPipicans(); 
    });
  }

  loadPipicans(): void {
    this.pipicanService.getPipicans().subscribe({
      next: (pipicans: Pipican[]) => {
        pipicans.forEach((pipican) => {
          this.addMarker(pipican);
        });
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
    new mapboxgl.Marker(dogMarkerElement)
      .setLngLat(pipican.coords)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`<p><strong>Barrio:</strong> ${pipican.barrio}</p>`)
      ) // offset: 25 es para poner el popup 25 px de distancia para que no tape la ubicación 
      .addTo(this.map);
  }
  
}
