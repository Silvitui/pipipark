import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  currentStep = signal<number>(0);
  animationClass = signal<string>('');
  answers = signal<{ [key: string]: any }>({
    personality: [],
  });

  personalityBase = [
   'aventurero', 'tranquilo', 'protector', 'curioso', 'energético',
      'gruñón', 'obediente', 'valiente', 'cariñoso', 'miedoso',
       'amistoso', 'perezoso' , 'juguetón','inseguro','territorial','sociable','líder','listo'
  ];

 
  personalityOptions = computed(() => {
    const gender = this.answers()['gender'];
    return this.personalityBase.map((p) => {
      if (gender === 'hembra') {
        return p
          .replace(/ón$/, 'ona')
          .replace(/o$/, 'a');
      }
      return p;
    });
  });

  questions = [
    { question: '¿Cómo se llama tu perro?', field: 'name', type: 'text' },
    { question: '¿Es macho o hembra?', field: 'gender', type: 'select', options: ['macho', 'hembra'] },
    { question: '¿Qué raza es?', field: 'breed', type: 'text' },
    { question: '¿Cuántos años tiene?', field: 'age', type: 'number' },
    { question: '¿Qué tamaño tiene?', field: 'size', type: 'text' },
    { question: '¿Está castrado o esterilizado?', field: 'neutered', type: 'select', options: ['sí', 'no'] },
    { question: 'Describe su personalidad', field: 'personality', type: 'multi-select' },
    { question: 'Sube una foto de tu perro', field: 'photo', type: 'file' },
    { question: 'Nombre del humano del perro', field: 'userName', type: 'text' },
    { question: 'Correo electrónico', field: 'email', type: 'email' },
    { question: 'Crea una contraseña', field: 'password', type: 'password' }
  ];

  nextStep(): void {
    if (this.currentStep() < this.questions.length - 1) {
      this.animationClass.set('animate-slide-left');
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 0) {
      this.animationClass.set('animate-slide-right');
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

    this.answers.update((a) => ({ ...a, personality: updated }));
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.answers.update((a) => ({ ...a, photo: file }));
    }
  }

  submitForm(): void {
    const finalData = this.answers();
    const payload = {
      userName: finalData['userName'] || '',
      email: finalData['email'] || '',
      password: finalData['password'] || '',
      dog: {
        name: finalData['name'] || '',
        gender: finalData['gender'] || '',
        breed: finalData['breed'] || '',
        age: Number(finalData['age']) || 0,
        size: finalData['size'] || '',
        neutered: finalData['neutered'] === 'sí',
        personality: finalData['personality'] || [],
        photo: finalData['photo'] || 'https://via.placeholder.com/150'
      }
    };

    this.authService.registerUser(payload).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Error en el registro:', err)
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
