import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  currentStep = signal<number>(0);
  answers = signal<{ [key: string]: any }>({});

  // 👇 Variable para controlar las clases de animación
  animationClass = signal<string>('');

  questions = [
    { question: '¿Cómo se llama tu perro?', field: 'name', type: 'text' },
    { question: 'Todos nos dan el mismo amor pero dinos, ¿es macho o hembra?', field: 'gender', type: 'text' },
    { question: '¿Qué raza es?', field: 'breed', type: 'text' },
    { question: '¿Cuántos años tiene?', field: 'age', type: 'number' },
    { question: '¿Qué tamaño tiene?', field: 'size', type: 'text' },
    {
      question: 'Describe su personalidad',
      field: 'personality',
      type: 'multi-select',
      options: ['aventurero', 'tranquilo', 'protector', 'curioso', 'energético', 'gruñón', 'obediente', 'valiente', 'juguetón', 'tímido', 'dominante', 'amistoso', 'perezoso', 'inteligente']
    },
    { question: 'Sube una foto de tu perro', field: 'photo', type: 'file' },
    { question: 'Nombre del humano del perro', field: 'userName', type: 'text' },
    { question: 'Correo electrónico', field: 'email', type: 'email' },
    { question: 'Crea una contraseña', field: 'password', type: 'password' }
  ];

  checkAuthStatus(): void {
    this.authService.checkAuthStatus();
  }

  nextStep(): void {
    if (this.currentStep() < this.questions.length - 1) {
      this.animationClass.set('animate-slide-left'); // 👈 Animación entrada desde la derecha
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 0) {
      this.animationClass.set('animate-slide-right'); // 👈 Animación entrada desde la izquierda
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  onAnimationEnd(): void {
    this.animationClass.set('');
  }

  submitForm(): void {
    const payload = {
      userName: this.answers()['userName'] || '',
      email: this.answers()['email'] || '',
      password: this.answers()['password'] || '',
      dog: {
        name: this.answers()['name'] || '',
        gender: this.answers()['gender'] || '',
        breed: this.answers()['breed'] || '',
        age: this.answers()['age'] || 0,
        size: this.answers()['size'] || '',
        personality: this.answers()['personality'] || [],
        photo: this.answers()['photo'] || 'https://via.placeholder.com/150'
      }
    };

    this.authService.registerUser(payload).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Error en el registro:', err)
    });
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.answers()['photo'] = input.files[0];
    }
  }

  addPersonality(option: string): void {
    const selectedPersonalities = this.answers()['personality'] ?? [];
    if (selectedPersonalities.includes(option)) {
      this.answers()['personality'] = selectedPersonalities.filter((p: any) => p !== option);
    } else {
      this.answers()['personality'] = [...selectedPersonalities, option];
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
    
  }
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
