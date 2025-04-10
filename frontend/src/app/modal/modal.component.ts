import {
  Component,
  Input,
  effect,
  inject,
  model,
  signal,
  computed
} from '@angular/core';
import { PipicanService } from '../services/pipican.service';
import { CompatibilityService } from '../services/compatibility.service';
import { ParkVisitType } from '../interfaces/parkVisitType';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Dog } from '../interfaces/dog.interface';
import { TimeSelectorToastComponent } from '../components/time-selector-toast/time-selector-toast.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [CommonModule, TimeSelectorToastComponent]
})
export class ModalComponent {
  selectedPipican = model<{ name: string; barrio: string; _id: string } | null>(null);

  pipicanService = inject(PipicanService);
  userService = inject(UserService);
  compatibilityService = inject(CompatibilityService);

  dogsInPark = signal<ParkVisitType[]>([]);
  userDogs = signal<Dog[]>([]);
  dogsToCheckIn = signal<string[]>([]);
  isLoading = signal(false);
  compatibilityResults = signal<{ name: string; compatibility: number }[]>([]);
  showModalSignal = signal(false);
  showTimeSelector = signal(false);

  lastCheckedIn = signal<{ parkId: string; userId: string } | null>(
    JSON.parse(localStorage.getItem('lastCheckIn') || 'null')
  );

  isCheckedIn = computed(() => {
    const currentUser = this.userService.getUser();
    const last = this.lastCheckedIn();
    return !!currentUser && last?.parkId === this.selectedPipican()?._id && last?.userId === currentUser?._id;
  });

  constructor() {
    effect(() => {
      const pipican = this.selectedPipican();
      if (pipican) {
        this.showModalSignal.set(true);
        this.loadDogs(pipican._id);
        this.loadUserDogs();
      }
    });

    effect(() => {
      const last = this.lastCheckedIn();
      if (last) {
        localStorage.setItem('lastCheckIn', JSON.stringify(last));
      } else {
        localStorage.removeItem('lastCheckIn');
      }
    });
  }

  loadDogs(parkId: string) {
    this.isLoading.set(true);
    this.pipicanService.getDogsInPipican(parkId).subscribe({
      next: (res) => {
        this.dogsInPark.set(res.dogsInPark);
        this.isLoading.set(false);
        if (this.userDogs().length) {
          this.loadCompatibility();
        }
      },
      error: (err) => {
        console.error('Error cargando perros del pipicán:', err);
        this.dogsInPark.set([]);
        this.isLoading.set(false);
      }
    });
  }

  loadUserDogs() {
    this.userService.loadUserDogs().subscribe({
      next: (dogs) => {
        this.userDogs.set(dogs.dogs);
        this.dogsToCheckIn.set(dogs.dogs.map(d => d._id));
        if (this.dogsInPark().length) {
          this.loadCompatibility();
        }
      },
      error: (err) => {
        console.error('Error al cargar los perros del usuario', err);
      }
    });
  }

  toggleDogSelection(dogId: string) {
    this.dogsToCheckIn.update(current =>
      current.includes(dogId)
        ? current.filter(id => id !== dogId)
        : [...current, dogId]
    );
  }

  checkIn(minutes: number) {
    const parkId = this.selectedPipican()?._id;
    const dogIds = this.dogsToCheckIn();
    const currentUser = this.userService.getUser();
    if (!parkId || dogIds.length === 0 || !currentUser) return;

    this.pipicanService.checkIn(parkId, dogIds, minutes).subscribe({
      next: (res) => {
        const visit = res.visit;
        this.lastCheckedIn.set({ parkId, userId: currentUser._id });

        if (minutes > 0) {
          setTimeout(() => {
            console.log('🕒 Expiración automática del check-in tras', minutes, 'min');
            this.checkOut();
          }, minutes * 60 * 1000);
        }

        this.loadDogs(parkId);
        this.compatibilityResults.set([]);
      },
      error: (err) => {
        console.error("Error al hacer check-in", err);
      }
    });
  }

  handleTimeSelection(minutes: number) {
    console.log('⏳ Tiempo seleccionado:', minutes);
    this.showTimeSelector.set(false);
    this.checkIn(minutes);
  }

  checkOut() {
    const parkId = this.selectedPipican()?._id;
    if (!parkId) return;

    this.pipicanService.checkOut(parkId).subscribe({
      next: () => {
        this.lastCheckedIn.set(null);
        this.loadDogs(parkId);
        this.compatibilityResults.set([]);
      },
      error: (err) => {
        console.error("Error al hacer check-out", err);
      }
    });
  }

  loadCompatibility() {
    const myDog = this.userDogs()[0];
    const parkId = this.selectedPipican()?._id;
    if (!myDog || !parkId) return;

    const otherDogs = this.dogsInPark().flatMap(v => v.dogs)
      .filter(d => d._id !== myDog._id)
      .map(d => ({
        name: d.name,
        personality: Array.isArray(d.personality) ? d.personality.join(', ') : d.personality
      }));

    this.compatibilityService.checkCompatibility({
      myDog: {
        name: myDog.name,
        personality: Array.isArray(myDog.personality) ? myDog.personality.join(', ') : myDog.personality
      },
      otherDogs,
      parkId
    }).subscribe({
      next: (res) => this.compatibilityResults.set(res.results),
      error: (err) => console.error('Error al calcular compatibilidad IA:', err)
    });
  }

  getCompatibilityForDog(dogName: string): number {
    const found = this.compatibilityResults().find(c => c.name === dogName);
    return found ? found.compatibility : 0;
  }

  getCompatibilityColor(value: number): string {
    if (value >= 75) return '#22c55e';
    if (value >= 50) return '#eab308';
    return '#ef4444';
  }

  getCompatibilityClass(value: number): string {
    if (value >= 80) return 'text-green-600 font-semibold';
    if (value >= 50) return 'text-yellow-500 font-medium';
    return 'text-red-500 font-medium';
  }

  closeModal() {
    this.showModalSignal.set(false);
  }

  isOwnDog(dogId: string): boolean {
    return this.userDogs().some(d => d._id === dogId);
  }
}