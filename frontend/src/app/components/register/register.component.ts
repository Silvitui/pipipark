import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { DogService } from './../../services/dog.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  authService = inject(AuthService);
  DogService = inject(DogService);
  router = inject(Router);
  currentStep = signal<number>(0);
  animationClass = signal<string>('');
  answers = signal<{ [key: string]: any }>({
    personality: [],
  });

  personalityBase = [
    'aventurero', 'tranquilo', 'protector', 'curioso', 'energético',
    'gruñón', 'obediente', 'valiente', 'cariñoso', 'miedoso',
    'amistoso', 'perezoso', 'juguetón', 'inseguro', 'territorial',
    'sociable', 'líder', 'audaz'
  ];

  // Personalidades adaptadas al género
  personalityOptions = computed(() => {
    const gender = this.answers()['gender'];
    return this.personalityBase.map(p => {
      if (gender === 'hembra') {
        return p.replace(/ón$/, 'ona').replace(/o$/, 'a');
      }
      return p;
    });
  });

  
  questions = [
    { question: '¿Cómo se llama tu perro?', field: 'name', type: 'text' },
    { question: '¿Es macho o hembra?', field: 'gender', type: 'custom-dropdown', options: ['macho', 'hembra'] },
    { question: '¿Qué raza es?', field: 'breed', type: 'text' },
    { question: '¿Cuándo nació tu perro?', field: 'age', type: 'date' },
    { question: '¿Qué tamaño tiene?', field: 'size', type: 'custom-dropdown', options: ['pequeño', 'mediano', 'grande'] },
    { question: '¿Está castrado o esterilizado?', field: 'neutered', type: 'custom-dropdown', options: ['sí', 'no'] },
    { question: 'Describe su personalidad', field: 'personality', type: 'multi-select' },
    { question: 'Sube una foto de tu perro', field: 'photo', type: 'file' },
    { question: 'Nombre del humano del perro', field: 'userName', type: 'text' },
    { question: 'Correo electrónico', field: 'email', type: 'email' },
    { question: 'Crea una contraseña', field: 'password', type: 'password' }
  ];


  setAnimation(direction: 'left' | 'right') {
    if (this.isMobile()) {
      this.animationClass.set('');
    } else {
      this.animationClass.set(direction === 'left' ? 'animate-slide-left' : 'animate-slide-right');
    }
  }

  nextStep(): void {
    if (this.currentStep() < this.questions.length - 1) {
      this.setAnimation('left');
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 0) {
      this.setAnimation('right');
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  onAnimationEnd(): void {
    this.animationClass.set('');
  }

  
  addPersonality(option: string): void {
    const selected = this.answers()['personality'] || [];
    const alreadySelected = selected.includes(option);
    const updated = alreadySelected
      ? selected.filter((o: string) => o !== option)
      : [...selected, option];

    this.answers.update(a => ({ ...a, personality: updated }));
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.answers.update(a => ({ ...a, photo: file }));
    }
  }

  formattedDate(): string | null {
    const date = this.answers()['age'];
    if (!date) return null;
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  handleDateChange(value: string): void {
    this.answers.update(a => ({ ...a, age: value }));
  }

 
  submitForm(): void {
    const finalData = this.answers();
    const dogPhotoFile: File = finalData['photo'];

    const payload = {
      userName: finalData['userName'] || '',
      email: finalData['email'] || '',
      password: finalData['password'] || '',
      dog: {
        name: finalData['name'] || '',
        gender: finalData['gender'] || '',
        breed: finalData['breed'] || '',
        birthday: finalData['age'] ? new Date(finalData['age']) : new Date(),
        size: finalData['size'] || '',
        castrated: finalData['neutered'] === 'sí',
        personality: finalData['personality'] || []
      }
    };

    this.authService.registerUser(payload).subscribe({
      next: (res) => {
        const dogId = res?.dog?._id;

        if (dogPhotoFile && dogId) {
          const formData = new FormData();
          formData.append('image', dogPhotoFile);

          this.DogService.uploadDogPhoto(dogId, formData).subscribe({
            next: () => {
              console.log(' Imagen subida correctamente');
              this.router.navigate(['/login']);
            },
            error: (err) => {
              console.error(' Error al subir la imagen:', err);
              this.router.navigate(['/login']);
            }
          });
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error(' Error en el registro:', err);
      }
    });
  }

 
  dropdownState = signal<{ [key: string]: boolean }>({});

  toggleDropdown(field: string) {
    const current = this.dropdownState();
    this.dropdownState.set({ ...current, [field]: !current[field] });
  }

  dropdownOpenFor(field: string): boolean {
    return this.dropdownState()[field] === true;
  }

  selectDropdown(field: string, value: string) {
    this.answers.update(a => ({ ...a, [field]: value }));
    const current = this.dropdownState();
    this.dropdownState.set({ ...current, [field]: false });
  }

 
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}
