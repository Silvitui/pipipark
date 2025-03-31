import { DogService } from './../../services/dog.service';
import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Dog } from '../../interfaces/dog.interface';

@Component({
  selector: 'app-dog-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dog-card.component.html',
})
export class DogCardComponent {
  @Input() dog!: Dog;
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  loading = signal(false);
  editing = signal(false);
form = signal<Partial<Dog>>({});

   dogService = inject(DogService);
   personalityOptions = [
    'aventurero', 'tranquilo', 'protector', 'curioso', 'energético',
    'gruñón', 'obediente', 'valiente', 'dependiente', 'miedoso',
    'amistoso', 'perezoso', 'juguetón', 'inseguro', 'territorial',
    'sociable', 'líder', 'listo'
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
        this.dog.photo = res.photo; // actualiza la imagen
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
  
    // Aquí llamas a tu servicio DogService para guardar cambios
    this.dogService.updateDog(this.dog._id, updated).subscribe({
      next: (res) => {
        this.dog = res.dog; // actualiza con los nuevos datos
        this.editing.set(false);
      },
      error: (err) => {
        console.error('Error al actualizar perro:', err);
      }
    });
  }
  
}
