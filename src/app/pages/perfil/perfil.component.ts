import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../../services/perfil.service';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent  implements OnInit {
  perfil: any = {};
  perfilEditado: any = {};
  modoEdicion: boolean = false;
  idCliente: number = 0;

  constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    this.idCliente = Number(localStorage.getItem('idCliente'));
    this.obtenerPerfil();
  }

  obtenerPerfil(): void {
    this.perfilService.obtenerPerfil(this.idCliente).subscribe({
      next: (data) => {
        this.perfil = data;
        this.perfilEditado = { ...data };
      },
      error: (err) => {
        console.error('Error al obtener perfil:', err);
        alert('No se pudo obtener la información del perfil.');
      }
    });
  }

  habilitarEdicion(): void {
    this.modoEdicion = true;
    this.perfilEditado = { ...this.perfil };
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.perfilEditado = { ...this.perfil };
  }

  guardarCambios(): void {
    this.perfilService.actualizarPerfil(this.idCliente, this.perfilEditado).subscribe({
      next: (data) => {
        this.perfil = data;
        this.modoEdicion = false;
        alert('Perfil actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        alert('Ocurrió un error al actualizar el perfil.');
      }
    });
  }
}