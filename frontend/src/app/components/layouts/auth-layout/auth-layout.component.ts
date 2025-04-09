import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent implements OnInit {
  router = inject(Router);
  imageLoaded = signal(false);
  screenWidth = signal(window.innerWidth);

  isMobile = computed(() => this.screenWidth() <= 768);
  isRegister = computed(() => this.router.url.includes('register'));

  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.screenWidth.set(window.innerWidth);
    });
    this.router.events.subscribe(() => {
      this.screenWidth.set(window.innerWidth);
    });
  }

  onLoad() {
    this.imageLoaded.set(true);
  }
}
