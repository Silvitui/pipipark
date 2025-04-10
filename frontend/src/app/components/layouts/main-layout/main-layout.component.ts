import { Component, inject, signal } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { MobileSidebarComponent } from '../../shared/mobile-sidebar/mobile-sidebar.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports : [SidebarComponent,FooterComponent,MobileSidebarComponent,RouterOutlet,CommonModule],
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  router = inject(Router);
sidebarOpen = signal(true);
  

  isSidebarOpen() {
    return this.sidebarOpen();
  }

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }
  hideFooter(): boolean {
    return this.router.url.startsWith('/map'); 
  }
}
