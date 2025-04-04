import { Component, signal } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { MobileSidebarComponent } from '../../shared/mobile-sidebar/mobile-sidebar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports : [SidebarComponent,FooterComponent,MobileSidebarComponent,RouterOutlet,CommonModule],
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  private sidebarOpen = signal(true);

  isSidebarOpen() {
    return this.sidebarOpen();
  }

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }
}
