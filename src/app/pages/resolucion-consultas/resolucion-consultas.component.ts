import { Component, OnInit } from '@angular/core';
import { ConsultasService } from '../../services/consultas.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resolucion-consultas',
  imports: [CommonModule, FormsModule],
  templateUrl: './resolucion-consultas.component.html',
  styleUrl: './resolucion-consultas.component.css'
})
export class ResolucionConsultasComponent implements OnInit {
  
  reclamos: any[] = [];
  reclamoSeleccionado: any = null;

  constructor(private consultasSrv: ConsultasService) {}

  ngOnInit(): void {
    this.cargarReclamos();
  }

  cargarReclamos(): void {
    this.consultasSrv.getReclamos().subscribe({
      next: (data) => this.reclamos = data,
      error: () => console.error('No se pudieron cargar los reclamos.')
    });
  }

  abrirModal(reclamo: any): void {
    this.reclamoSeleccionado = { ...reclamo }; // clonamos para edición
  }

  cerrarModal(): void {
    this.reclamoSeleccionado = null;
  }

  guardarResolucion(): void {
    if (!this.reclamoSeleccionado) return;

    this.consultasSrv.actualizarReclamo(this.reclamoSeleccionado).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarReclamos();
      },
      error: () => console.error('Error al guardar resolución.')
    });
  }

  getEstadoNombre(estado: number): string {
    switch (estado) {
      case 1: return 'Abierto';
      case 2: return 'En proceso';
      case 3: return 'Cerrado';
      default: return 'Desconocido';
    }
  }
}
