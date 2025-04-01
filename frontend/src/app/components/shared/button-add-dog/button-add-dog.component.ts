import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { DogService } from '../../../services/dog.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-button-add-dog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './button-add-dog.component.html',
  styleUrl: './button-add-dog.component.scss'
})
export class ButtonAddDogComponent {
  @Output() close = new EventEmitter<void>();
  private dogService = inject(DogService);
  previewImage = signal<string | null>(null);

  formData = signal({
    name: '',
    gender: '',
    breed: '',
    birthday: '',
    size: '',
    castrated: '',
    personality: [] as string[],
    photo: null as File | null
  });

  allPersonalities = [ 'aventurero', 'tranquilo', 'protector', 'curioso', 'energético',
    'gruñón', 'obediente', 'valiente', 'cariñoso', 'miedoso',
     'amistoso', 'perezoso' , 'juguetón','inseguro','territorial','sociable','líder','audaz'];
  loading = signal(false);
  error = signal<string | null>(null);

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.formData.update(fd => ({ ...fd, photo: file }));
    }
  }

  togglePersonality(person: string) {
    this.formData.update(fd => {
      const index = fd.personality.indexOf(person);
      const updated = [...fd.personality];
      if (index >= 0) {
        updated.splice(index, 1);
      } else {
        updated.push(person);
      }
      return { ...fd, personality: updated };
    });
  }

  submitForm() {
    this.loading.set(true);
    this.error.set(null);
  
    const fd = this.formData();
    const payload = {
      name: fd.name,
      gender: fd.gender,
      breed: fd.breed,
      birthday: new Date(fd.birthday), // 
      size: fd.size,
      castrated: fd.castrated === 'sí',
      personality: fd.personality,
      photo: ''
    };
  
    from(this.dogService.addDog(payload)).pipe(
      switchMap((res: any) => {
        if (fd.photo && res?.dog?._id) {
          const form = new FormData();
          form.append('image', fd.photo);
          return this.dogService.uploadDogPhoto(res.dog._id, form);
        }
        return from([null]);
      }),
      tap(() => {
        this.loading.set(false);
        this.close.emit();
      }),
      catchError(err => {
        console.error('Error al añadir perro:', err);
        this.loading.set(false);
        this.error.set('Hubo un problema al añadir el perro');
        return from([]);
      })
    ).subscribe();
  }
  
  cancel() {
    this.close.emit();
  }
}
