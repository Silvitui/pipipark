import { Component, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

import { PipicanService } from '../../services/pipican.service';
import { MapService } from '../../services/map.service';
import { Pipican } from '../../interfaces/pipican';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mapa',
  standalone: true,
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  imports: [CommonModule, FormsModule, ModalComponent],
})
export class MapaComponent implements AfterViewInit {
  pipicanService = inject(PipicanService);
  mapService = inject(MapService);

  selectedPipican = signal<{ name: string; barrio: string; _id: string } | null>(null);
  searchTerm: string = '';
  allPipicans: Pipican[] = [];
  showSearchBar: boolean = false;
  showResults: boolean = false;

  ngAfterViewInit(): void {
    this.mapService.initMap('map', environment.mapboxToken);
    this.loadPipicans();
  }

  loadPipicans(): void {
    this.pipicanService.getPipicans().subscribe({
      next: (pipicans: Pipican[]) => {
        this.allPipicans = pipicans;
        pipicans.forEach((pipican) => {
          this.mapService.addMarker(pipican, () => {
            this.selectedPipican.set({
              name: pipican.name ?? '',
              barrio: pipican.barrio ?? '',
              _id: pipican._id
            });
          });
        });
      },
      error: (err) => {
        console.error('Error cargando pipicans:', err);
      }
    });
  }

  filteredPipicans(): Pipican[] {
    if (!this.searchTerm.trim()) return [];

    const term = this.searchTerm.toLowerCase();
    return this.allPipicans
      .filter(p => (p.name ?? '').toLowerCase().includes(term) || (p.barrio ?? '').toLowerCase().includes(term))
      .slice(0, 5);
  }

  goToPipican(pipican: Pipican): void {
    this.mapService.flyTo(pipican.coords);
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
