import {
  Component,
  effect,
  signal,
  inject,
  model,
  computed
} from '@angular/core';
import { PipicanService } from '../../services/pipican.service';
import { CompatibilityService } from '../../services/compatibility.service';
import { ParkVisitType } from '../../interfaces/parkVisitType';
import { UserService } from '../../services/user.service';
import { CompatibilityResponse, Dog } from '../../interfaces/dog.interface';
import { UserDogService } from '../../services/user-dog.service';
import { TimeSelectorToastComponent } from '../shared/time-selector-toast/time-selector-toast.component';
import { CommonModule } from '@angular/common';
import { DogDetailModalComponent } from '../dog-detail-modal/dog-detail-modal.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, TimeSelectorToastComponent, DogDetailModalComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  pipicanService = inject(PipicanService);
  userService = inject(UserService);
  userDogService = inject(UserDogService);
  compatibilityService = inject(CompatibilityService);

  selectedPipican = model<{ name: string; barrio: string; _id: string } | null>(null);
  dogsInPark = signal<ParkVisitType[]>([]);
  userDogs = computed(() => this.userDogService.getDogs());
  dogsToCheckIn = signal<string[]>([]);
  compatibilityResults = signal<CompatibilityResponse[]>([]);
  isLoading = signal(false);
  showModalSignal = signal(false);
  showTimeSelector = signal(false);
  selectedDogForDetail = signal<Dog | null>(null);
  compatibilityForDetail = signal<CompatibilityResponse | null>(null);

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
        if (this.userDogs().length) this.loadCompatibility();
      },
      error: (err) => {
        console.error('Error cargando perros del pipicán:', err);
        this.dogsInPark.set([]);
        this.isLoading.set(false);
      }
    });
  }

  loadUserDogs() {
    this.userDogService.fetchAndSetUserDogs();
    setTimeout(() => {
      const loadedDogs = this.userDogs();
      this.dogsToCheckIn.set(loadedDogs.map(d => d._id));
      if (this.dogsInPark().length) this.loadCompatibility();
    }, 300);
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
      next: () => {
        this.lastCheckedIn.set({ parkId, userId: currentUser._id });

        if (minutes > 0) {
          setTimeout(() => {
            this.checkOut();
          }, minutes * 60 * 1000);
        }

        this.loadUserDogs();
        setTimeout(() => {
          this.loadDogs(parkId);
          this.selectedPipican.set({ ...this.selectedPipican()! });
          this.isLoading.set(false);
        }, 300);

        this.compatibilityResults.set([]);
      },
      error: (err) => console.error('Error al hacer check-in', err)
    });
  }

  handleTimeSelection(minutes: number) {
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
      error: (err) => console.error('Error al hacer check-out', err)
    });
  }

  loadCompatibility() {
    const myDog = this.userDogs()[0];
    const parkId = this.selectedPipican()?. _id;
    if (!myDog || !parkId) return;

    const otherDogs = this.dogsInPark().flatMap(v => v.dogs).filter(d => d._id !== myDog._id);

    otherDogs.forEach(dog => {
      this.compatibilityService.checkCompatibility({
        dog1Id: myDog._id,
        dog2Id: dog._id
      }).subscribe({
        next: (res) => {
          this.compatibilityResults.update(current => [
            ...current.filter(c => c.name !== dog.name),
            res
          ]);
        },
        error: (err) => console.error('Error compatibilidad:', err)
      });
    });
  }

  getCompatibilityForDog(dogName: string): number {
    const found = this.compatibilityResults().find(c => c.name === dogName);
    return found ? found.score : 0;
  }

  getCompatibilityColor(value: number): string {
    if (value >= 75) return '#22c55e';
    if (value >= 50) return '#eab308';
    return '#ef4444';
  }

  isOwnDog(dogId: string): boolean {
    return this.userDogs().some(d => d._id === dogId);
  }

  closeModal() {
    this.showModalSignal.set(false);
  }

  openDogDetail(dog: Dog) {
    this.selectedDogForDetail.set(dog);
    const myDog = this.userDogs()[0];

    if (myDog && dog._id !== myDog._id) {
      this.compatibilityService
        .checkCompatibility({ dog1Id: myDog._id, dog2Id: dog._id })
        .subscribe(res => this.compatibilityForDetail.set(res));
    } else {
      this.compatibilityForDetail.set(null);
    }
  }

  closeDogDetail() {
    this.selectedDogForDetail.set(null);
    this.compatibilityForDetail.set(null);
  }
}
