import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Dog } from '../../../interfaces/dog.interface';

@Component({
  standalone: true,
  selector: 'app-mini-dog-card',
  imports: [CommonModule],
  templateUrl: './mini-dog-card.component.html',
})
export class MiniDogCardComponent {
  @Input() dog!: Dog;
  
}
