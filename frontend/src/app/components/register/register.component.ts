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
  touchedSteps = signal<{ [key: number]: boolean }>({});
  showGlobalError = signal(false);

  answers = signal<{ [key: string]: any }>({
    personality: [],
  });

  personalityBase = [
    'aventurero', 'tranquilo', 'protector', 'curioso', 'energético',
    'gruñón', 'obediente', 'valiente', 'cariñoso', 'miedoso',
    'amistoso', 'perezoso', 'juguetón', 'inseguro', 'territorial',
    'sociable', 'líder', 'audaz'
  ];

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
    { question: '¿Cómo se llama tu peludo?', field: 'name', type: 'text', required: true },
    { question: '¿Es macho o hembra?', field: 'gender', type: 'custom-dropdown', options: ['macho', 'hembra'], required: true },
    { question: '¿Qué raza es?', field: 'breed', type: 'text', required: true },
    { question: '¿Cuándo nació tu perro?', field: 'age', type: 'date', required: true },
    { question: '¿Qué tamaño tiene?', field: 'size', type: 'custom-dropdown', options: ['pequeño', 'mediano', 'grande'], required: true },
    { question: '¿Está castrado o esterilizado?', field: 'neutered', type: 'custom-dropdown', options: ['sí', 'no'], required: true },
    { question: 'Describe su personalidad', field: 'personality', type: 'multi-select', required: true },
    { question: 'Sube una foto de tu perro', field: 'photo', type: 'file', required: false },
    { question: 'Nombre del humano del perro', field: 'userName', type: 'text', required: true },
    { question: 'Correo electrónico', field: 'email', type: 'email', required: true },
    { question: 'Crea una contraseña', field: 'password', type: 'password', required: true }
  ];

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

  setAnimation(direction: 'left' | 'right') {
    if (this.isMobile()) {
      this.animationClass.set('');
    } else {
      this.animationClass.set(direction === 'left' ? 'animate-slide-left' : 'animate-slide-right');
    }
  }

  onAnimationEnd() {
    this.animationClass.set('');
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

  markStepAsTouched(index: number) {
    this.touchedSteps.update(t => ({ ...t, [index]: true }));
  }

  fieldHasError(field: string): boolean {
    const value = this.answers()[field];
    const isEmail = field === 'email';
    const required = this.questions.find(q => q.field === field)?.required;

    if (!required) return false;

    if (field === 'personality') return !value || value.length === 0;
    if (isEmail) return !value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return value === undefined || value === null || value === '';
  }

  getError(field: string): string | null {
    if (!this.fieldHasError(field)) return null;

    if (field === 'email') return 'Introduce un correo válido';
    if (field === 'personality') return 'Selecciona al menos una opción';
    return 'Este campo es obligatorio';
  }

  nextStep() {
    const current = this.currentStep();
    const currentField = this.questions[current].field;

    this.markStepAsTouched(current);

    if (this.fieldHasError(currentField)) return;

    if (current < this.questions.length - 1) {
      this.setAnimation('left');
      this.currentStep.set(current + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 0) {
      this.setAnimation('right');
      this.currentStep.set(this.currentStep() - 1);
    }
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

  submitForm(): void {
    let hasError = false;
    const finalAnswers = this.answers();
    const dogPhotoFile: File = finalAnswers['photo'];

    this.questions.forEach((q, i) => {
      if (q.required && this.fieldHasError(q.field)) {
        hasError = true;
        this.markStepAsTouched(i);
      }
    });

    if (hasError) {
      const firstErrorIndex = this.questions.findIndex(q => this.fieldHasError(q.field));
      if (firstErrorIndex !== -1) this.currentStep.set(firstErrorIndex);
      this.showGlobalError.set(true);
      return;
    }

    const payload = {
      userName: finalAnswers['userName'] || '',
      email: finalAnswers['email'] || '',
      password: finalAnswers['password'] || '',
      dog: {
        name: finalAnswers['name'] || '',
        gender: finalAnswers['gender'] || '',
        breed: finalAnswers['breed'] || '',
        birthday: finalAnswers['age'] ? new Date(finalAnswers['age']) : new Date(),
        size: finalAnswers['size'] || '',
        castrated: finalAnswers['neutered'] === 'sí',
        personality: finalAnswers['personality'] || []
      }
    };

    this.authService.registerUser(payload).subscribe({
      next: (res) => {
        const dogId = res?.dog?._id;
        if (dogPhotoFile && dogId) {
          const formData = new FormData();
          formData.append('photo', dogPhotoFile);
          this.DogService.uploadDogPhoto(dogId, formData).subscribe({
            next: () => this.router.navigate(['/login']),
            error: () => this.router.navigate(['/login'])
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
}
