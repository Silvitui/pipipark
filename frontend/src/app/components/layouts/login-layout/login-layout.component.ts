import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss'],
  imports: [RouterOutlet]
})
export class LoginLayoutComponent {
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
