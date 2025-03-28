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
  onLoad() { this.imageLoaded.set(true); }
}
