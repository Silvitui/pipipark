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
      center: [2.154007, 41.390205], 
      zoom: 12,
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
    const marker = new mapboxgl.Marker({ color: 'purple' }) 
      .setLngLat(pipican.coords) 
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <p><strong>Barrio:</strong> ${pipican.barrio}</p>
          <p><strong>Coordenadas:</strong> ${pipican.coords.join(', ')}</p>
        `)
      )
      .addTo(this.map);
  }
}
