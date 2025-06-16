import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component'; // ajusta la ruta si está en otro lado

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
  sidebarAbierto: boolean = true;

  nombreCliente: string = '';
  ngOnInit(): void {
    this.nombreCliente = localStorage.getItem('nombreUsuario') || '';
  }
}
