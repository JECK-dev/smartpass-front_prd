import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ContratoService } from '../../../services/contrato.service';
import { Contrato } from '../../../models/contrato.model';

@Component({
  selector: 'app-lista-contratos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-contratos.component.html',
  styleUrls: ['./lista-contratos.component.css']
})
export class ListaContratosComponent implements OnInit {

  contratos: Contrato[] = [];
  filtroCodigo = '';
  filtroEstado = '';

  // 🔹 Propiedades nuevas para el modal
  mostrarModal = false;
  contratoSeleccionado!: Contrato;
  nuevoEstado: number = 0;

  constructor(private contratoService: ContratoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarContratosPorCliente();
  }

  // ✅ Método original para cargar contratos
  cargarContratosPorCliente(): void {
    const idCliente = Number(localStorage.getItem('idCliente'));
    if (!idCliente) {
      alert('ID de cliente no encontrado en la sesión');
      return;
    }

    this.contratoService.getContratosPorCliente(idCliente).subscribe({
      next: (data) => {
        this.contratos = data;
      },
      error: (err) => {
        console.error(err);
        alert('Error al cargar contratos');
      }
    });
  }

  limpiarFiltros(): void {
    this.filtroCodigo = '';
    this.filtroEstado = '';
  }

  get contratosFiltrados(): Contrato[] {
    return this.contratos.filter(c =>
      (!this.filtroCodigo || c.nroContrato.toString().includes(this.filtroCodigo)) &&
      (!this.filtroEstado || this.estadoTexto(c.idEstado) === this.filtroEstado)
    );
  }

  estadoTexto(estado: number): string {
    switch (estado) {
      case 1: return 'Activo';
      case 2: return 'Baja';
      case 3: return 'Suspendido';
      default: return 'Desconocido';
    }
  }

  // ✅ Mantiene tu funcionalidad de dar de baja
  darDeBaja(contrato: Contrato): void {
    if (!confirm(`¿Seguro que deseas dar de baja el contrato ${contrato.nroContrato}?`)) return;

    this.contratoService.darDeBaja(contrato.idContrato).subscribe({
      next: () => {
        alert(`Contrato ${contrato.nroContrato} dado de baja correctamente`);
        this.cargarContratosPorCliente();
      },
      error: (err) => {
        console.error(err);
        alert('Error al dar de baja contrato');
      }
    });
  }

  // 🔹 Abrir modal para cambiar modalidad
  abrirModal(contrato: Contrato): void {
    this.contratoSeleccionado = { ...contrato };
    this.nuevoEstado = contrato.idEstado;
    this.mostrarModal = true;
  }

  // 🔹 Cerrar modal
  cerrarModal(): void {
    this.mostrarModal = false;
  }

  // 🔹 Guardar cambio de modalidad
  guardarCambioModalidad(): void {
    if (this.nuevoEstado === this.contratoSeleccionado.idEstado) {
      alert('No se ha realizado ningún cambio.');
      return;
    }

    this.contratoService.cambiarModalidad(this.contratoSeleccionado.idContrato, this.nuevoEstado)
      .subscribe({
        next: () => {
          alert('Modalidad actualizada correctamente.');
          this.mostrarModal = false;
          this.cargarContratosPorCliente();
        },
        error: (err) => {
          const mensaje = err.error?.mensaje || 'Error al cambiar modalidad.';
          alert(mensaje);
        }
      });
  }
}
