import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CrearContratoComponent } from '../crear-contrato/crear-contrato.component';
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

  constructor(private contratoService: ContratoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarContratosPorCliente();
  }

  // ✅ Nuevo método
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

  darDeBaja(contrato: Contrato): void {
    if (!confirm(`¿Seguro que deseas dar de baja el contrato ${contrato.nroContrato}?`)) return;

    this.contratoService.darDeBaja(contrato.idContrato).subscribe({
      next: () => {
        alert(`Contrato ${contrato.nroContrato} dado de baja correctamente`);
        this.cargarContratosPorCliente(); // ✅ ahora sí existe
      },
      error: (err) => {
        console.error(err);
        alert('Error al dar de baja contrato');
      }
    });
  }
}