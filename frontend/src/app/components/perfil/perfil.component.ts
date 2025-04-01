import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DogCardComponent } from '../dog-card/dog-card.component';
import { UserService } from '../../services/user.service';
import { Dog } from '../../interfaces/dog.interface';

import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { MobileSidebarComponent } from '../shared/mobile-sidebar/mobile-sidebar.component';
import { MiniDogCardComponent } from '../shared/mini-dog-card/mini-dog-card.component';
import { ButtonAddDogComponent } from '../shared/button-add-dog/button-add-dog.component';



@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, MobileSidebarComponent,SidebarComponent,DogCardComponent,MiniDogCardComponent,ButtonAddDogComponent],
  templateUrl: './perfil.component.html',
})
export class PerfilComponent implements OnInit {
  userService = inject(UserService);
  addDogOpen = signal(false);


  user = computed(() => this.userService.getUser());
  dogs = computed(() => this.userService.getDogs());

  editing = signal(false);
  form = signal({ userName: '', email: '' });

  changingPassword = signal(false);
  passwordForm = signal({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.userService.fetchAndSetUser(); // 👈 Esto es clave para cargar todo

    const currentUser = this.user();
    if (currentUser) {
      this.form.set({
        userName: currentUser.userName ?? '',
        email: currentUser.email ?? ''
      });
    }
  }
  handleDogModalClose() {
    this.addDogOpen.set(false);
    this.userService.fetchAndSetUser(); // refresca los perros
  }
  startEditing() {
    const currentUser = this.user();
    if (currentUser) {
      this.form.set({
        userName: currentUser.userName,
        email: currentUser.email
      });
      this.editing.set(true);
    }
  }

  cancelEdit() {
    this.editing.set(false);
  }

  saveChanges() {
    const updated = this.form();
    if (!updated.userName || !updated.email) {
      console.warn('❗ No hay datos que actualizar');
      return;
    }
  
    console.log('📤 Enviando al backend:', updated);
  
    this.userService.updateProfile(updated).subscribe({
      next: () => {
        this.userService.fetchAndSetUser();
        this.editing.set(false);
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
      }
    });
  }
  
  
  togglePasswordForm() {
    this.changingPassword.update(v => !v);
    this.passwordForm.set({ currentPassword: '', newPassword: '', confirmPassword: '' });
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  submitPasswordChange() {
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm();

    if (!currentPassword || !newPassword || !confirmPassword) {
      this.errorMessage.set('Por favor, completa todos los campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Las contraseñas nuevas no coinciden.');
      return;
    }

    this.userService.changePassword({ currentPassword, newPassword, confirmPassword }).subscribe({
      next: () => {
        this.successMessage.set('Contraseña actualizada correctamente.');
        this.errorMessage.set('');
        this.passwordForm.set({ currentPassword: '', newPassword: '', confirmPassword: '' });
        this.changingPassword.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al cambiar la contraseña.');
        this.successMessage.set('');
      }
    });
    
  }

  trackById(index: number, dog: Dog) {
    return dog._id;
  }
}
