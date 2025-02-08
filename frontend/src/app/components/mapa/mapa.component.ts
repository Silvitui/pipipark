import { Component, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environment'; 
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',  
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit { // ngAfterViewInit porque Mapbox es impaciente y necesita que el DOM esté listo para no petar.
  map!: mapboxgl.Map;

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2.154007, 41.390205], // Barcelona
      zoom: 12,
      accessToken: environment.mapboxToken 
    });

    // Añadir un marker de prueba
    new mapboxgl.Marker({ color: 'green' })
      .setLngLat([2.154007, 41.390205])
      .addTo(this.map);
  }
}
