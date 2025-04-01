import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss'],
  imports: [RouterOutlet]
})
export class LoginLayoutComponent {
  // Signal to track if image is loaded
  imageLoaded = signal(false);

  // Signal to track if screen is mobile
  isMobile = signal(false);

  constructor() {
    // Check if the screen is mobile
    this.checkIfMobile();
    // Re-check if window size changes
    window.addEventListener('resize', () => this.checkIfMobile());
  }

  // Function to check if the screen is mobile
  checkIfMobile() {
    this.isMobile.set(window.innerWidth <= 768); // You can adjust the breakpoint here
  }

  // Function to set the image as loaded
  onLoad() { 
    this.imageLoaded.set(true); 
  }
}
