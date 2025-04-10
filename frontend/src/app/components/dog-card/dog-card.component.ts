import { DogService } from './../../services/dog.service';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dog } from '../../interfaces/dog.interface';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { 
  faDog, 
  faCalendarDay, 
  faRulerCombined,
  faCheckCircle,
  faHeart,
  faChevronUp,
  faChevronDown,
  faPen,
  faSave,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dog-card',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './dog-card.component.html',
})
export class DogCardComponent {
  @Input() dog!: Dog;
  @Output() select = new EventEmitter<Dog>();

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  loading = signal(false);
  editing = signal(false);
  form = signal<Partial<Dog>>({});
  selectDog() {
    this.select.emit(this.dog);
  }
  
  dogService = inject(DogService);
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faDog, faCalendarDay, faRulerCombined,
      faCheckCircle, faHeart, faChevronUp,
      faChevronDown, faPen, faSave, faSpinner
    );
  }
  personalityOptions = [
    'aventurero', 'tranquilo', 'protector', 'curioso', 'energético',
    'gruñón', 'obediente', 'valiente', 'dependiente', 'miedoso',
    'amistoso', 'perezoso', 'juguetón', 'inseguro', 'territorial',
    'sociable', 'líder', 'audaz'
  ];
  showPersonalityOptions = signal(false);

  togglePersonalityEditor() {
    this.showPersonalityOptions.update(v => !v);
  }
  
  togglePersonality(trait: string) {
    const current = this.form().personality || [];
    const updated = current.includes(trait)
      ? current.filter(p => p !== trait)
      : [...current, trait];
    this.form.update(f => ({ ...f, personality: updated }));
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file) {
      this.selectedFile.set(file);

      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onUpload() {
    if (!this.selectedFile() || !this.dog?._id) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile()!);

    this.loading.set(true);
    this.dogService.uploadDogPhoto(this.dog._id, formData).subscribe({
      next: (res) => {
        this.dog.photo = res.photo;
        this.previewUrl.set(null);
        this.selectedFile.set(null);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al subir la imagen:', err);
        this.loading.set(false);
      }
    });
  }

  startEditing() {
    this.editing.set(true);
    this.form.set({ ...this.dog });
  }
  
  cancelEdit() {
    this.editing.set(false);
  }
  
  saveDogChanges() {
    const updated = this.form();
  
    this.dogService.updateDog(this.dog._id, updated).subscribe({
      next: (res) => {
        this.dog = res.dog;
        this.editing.set(false);
      },
      error: (err) => {
        console.error('Error al actualizar perro:', err);
      }
    });
  }
}