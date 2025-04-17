
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Pipican } from '../interfaces/pipican';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: mapboxgl.Map;

  initMap(containerId: string, token: string): mapboxgl.Map {
    this.map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2.1763, 41.3879],
      zoom: 12.8,
      accessToken: token,
    });
    return this.map;
  }

  addMarker(pipican: Pipican, onClick: () => void): void {
    const el = document.createElement('div');
    el.className = 'dog-marker';
    el.style.backgroundImage = 'url(assets/dog-icon.png)';
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.backgroundSize = 'contain';
    el.style.cursor = 'pointer';

    new mapboxgl.Marker(el)
      .setLngLat(pipican.coords)
      .addTo(this.map)
      .getElement()
      .addEventListener('click', onClick);
  }

  flyTo(coords: [number, number]): void {
    this.map.flyTo({ center: coords, zoom: 15, essential: true });
  }
  flyToPipican(pipican: Pipican): void {
    this.flyTo(pipican.coords);
  }
  
  getMap(): mapboxgl.Map {
    return this.map;
  }
}
