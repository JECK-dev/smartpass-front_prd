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
    const idCliente = Number(localStorage.getItem('idCliente'));
    if (!idCliente) {
      alert('ID de cliente no encontrado en la sesión');
      return;
    }

    this.contratoService.getContratosPorCliente(idCliente).subscribe(data => {
      this.contratos = data;
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
    contrato.idEstado = 2; // Visualmente lo marcamos como Baja
    // Aquí puedes agregar un llamado PUT si quieres persistirlo
  }
}