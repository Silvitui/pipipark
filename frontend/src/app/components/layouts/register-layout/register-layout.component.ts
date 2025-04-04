import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register-layout',
  imports: [RouterOutlet],
  templateUrl: './register-layout.component.html',
  styleUrl: './register-layout.component.scss'
})
export class RegisterLayoutComponent {
  imageLoaded = signal(false);
  isMobile = signal(false);

  constructor() {
    this.checkIfMobile();
    window.addEventListener('resize', () => this.checkIfMobile());
  }


  checkIfMobile() {
    this.isMobile.set(window.innerWidth <= 768);
  }


  onLoad() { 
    this.imageLoaded.set(true); 
  }
}
