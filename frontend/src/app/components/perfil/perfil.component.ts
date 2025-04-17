import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DogCardComponent } from '../dog-card/dog-card.component';
import { ButtonAddDogComponent } from '../shared/button-add-dog/button-add-dog.component';
import { DeleteDogComponent } from '../delete-dog/delete-dog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Dog } from '../../interfaces/dog.interface';
import { UserService } from '../../services/user.service';
import { UserDogService } from '../../services/user-dog.service';
import { DogService } from '../../services/dog.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DogCardComponent,
    ButtonAddDogComponent,
    DeleteDogComponent,
    FontAwesomeModule
  ],
  templateUrl: './perfil.component.html',
})
export class PerfilComponent implements OnInit {
  userService = inject(UserService);
  userDogService = inject(UserDogService);
  DogService = inject(DogService);

  addDogOpen = signal(false);
  selectedDogToDelete = signal<Dog | null>(null);
  showDeleteModal = signal(false);

  user = computed(() => this.userService.getUser());
  dogs = computed(() => this.userDogService.getDogs());

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
    this.userService.fetchUserOnly();

    this.userDogService.fetchAndSetUserDogs();

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
    this.userDogService.fetchAndSetUserDogs();
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
    if (!updated.userName || !updated.email) return;

    this.userService.updateProfile(updated).subscribe({
      next: () => {
        this.userService.fetchUserOnly();
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

  openDeleteModal(dog: Dog) {
    this.selectedDogToDelete.set(dog);
    this.showDeleteModal.set(true);
  }

  handleModalClose() {
    this.showDeleteModal.set(false);
    this.selectedDogToDelete.set(null);
  }

  handleDeleteConfirmed(dogId: string) {
    this.DogService.deleteDog(dogId).subscribe({
      next: () => {
        this.userDogService.fetchAndSetUserDogs();
        this.showDeleteModal.set(false);
        this.selectedDogToDelete.set(null);
      },
      error: (err) => {
        console.error('Error al eliminar el perro:', err);
      }
    });
  }
}
