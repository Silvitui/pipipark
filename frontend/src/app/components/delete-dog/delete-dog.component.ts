import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dog } from '../../interfaces/dog.interface';


@Component({
  selector: 'app-delete-dog-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-dog.component.html',
  styleUrls: ['./delete-dog.component.scss'],
})
export class DeleteDogComponent {
  @Input() dog!: Dog;
  @Output() close = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<string>();

  confirmDelete() {
    this.confirmed.emit(this.dog._id);
  }

  cancel() {
    this.close.emit();
  }
}
