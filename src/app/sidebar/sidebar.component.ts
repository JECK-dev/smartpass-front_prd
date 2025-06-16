import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() sidebarAbierto: boolean = true;
  @Output() toggle = new EventEmitter<boolean>();

  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
    this.toggle.emit(this.sidebarAbierto); // ✅ Emitimos el nuevo estado
  }
}
