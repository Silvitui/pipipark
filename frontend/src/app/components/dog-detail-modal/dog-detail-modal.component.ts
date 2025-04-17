import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompatibilityResponse, Dog } from '../../interfaces/dog.interface';


@Component({
  selector: 'app-dog-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dog-detail-modal.component.html',
  styleUrls: ['./dog-detail-modal.component.scss']
})
export class DogDetailModalComponent {
  @Input() dog: Dog | null = null;
  @Input() compatibility: CompatibilityResponse | null = null;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
