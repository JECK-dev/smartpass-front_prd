import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CruceService } from '../../../services/cruce.service';

@Component({
  selector: 'app-his-crucespeaje',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './his-crucespeaje.component.html',
  styleUrls: ['./his-crucespeaje.component.css']
})
export class HisCrucespeajeComponent implements OnInit {
  filtroPlaca: string = '';
  filtroDesde: string = '';
  filtroHasta: string = '';
  transitos: any[] = [];
  transitosFiltrados: any[] = [];
  transitosPaginados: any[] = [];
  paginaActual: number = 1;
  tamañoPagina: number = 20;
  totalPaginas: number = 1;

  constructor(private cruceService: CruceService) {}

  ngOnInit(): void {
    let idCliente = 0;

    if (typeof window !== 'undefined' && window.localStorage) {
      const storedId = localStorage.getItem('idCliente');
      if (storedId) {
        idCliente = Number(storedId);
      }
    }

    if (idCliente) {
      this.cruceService.getTransitosPorCliente(idCliente).subscribe({
        next: (data) => {
          this.transitos = data.map(t => ({
            tr_id: t.tr_id ?? t.id ?? null,
            tr_fecha: t.tr_fecha ?? t.fecha ?? null,
            tr_placa: t.tr_placa ?? t.placa ?? '',
            tr_plaza: t.tr_plaza ?? t.plaza ?? null,
            tr_via: t.tr_via ?? t.via ?? null,
            tr_categoria: t.tr_categoria ?? t.categoria ?? null,
            tr_monto: t.tr_monto ?? t.monto ?? 0,
            tr_igv: t.tr_igv ?? t.igv ?? 0,
            id_vehiculo: t.id_vehiculo ?? t.vehiculo ?? null
          }));
          this.aplicarFiltros();
        },
        error: (err) => {
          console.error('Error al obtener transitos:', err);
        }
      });
    }
  }

  aplicarFiltros(): void {
    let filtrados = this.transitos;

    // Normaliza fechas
    const desde = this.filtroDesde ? new Date(this.filtroDesde + 'T00:00:00') : null;
    const hasta = this.filtroHasta ? new Date(this.filtroHasta + 'T23:59:59.999') : null;

    // Filtro por placa
    if (this.filtroPlaca.trim()) {
      const placa = this.filtroPlaca.toLowerCase();
      filtrados = filtrados.filter(t => t.tr_placa?.toLowerCase().includes(placa));
    }

    // Filtro por rango de fechas
    if (desde) {
      filtrados = filtrados.filter(t => new Date(t.tr_fecha) >= desde);
    }
    if (hasta) {
      filtrados = filtrados.filter(t => new Date(t.tr_fecha) <= hasta);
    }

    this.transitosFiltrados = filtrados;
    this.paginaActual = 1;
    this.totalPaginas = Math.max(1, Math.ceil(this.transitosFiltrados.length / this.tamañoPagina));
    this.actualizarPagina();
  }

  calcularTotal(): number {
    return this.transitosFiltrados.reduce((acc, cur) => acc + (cur.tr_monto || 0), 0);
  }

  limpiarFiltros(): void {
    this.filtroPlaca = '';
    this.filtroDesde = '';
    this.filtroHasta = '';
    this.aplicarFiltros();
  }

  descargarComprobante(transito: any) {
    const contenido = `Comprobante de Peaje\nPlaca: ${transito.tr_placa}\nFecha: ${transito.tr_fecha}\nPlaza: ${transito.tr_plaza}\nMonto: S/. ${transito.tr_monto}`;
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprobante_${transito.tr_id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  actualizarPagina(): void {
    const inicio = (this.paginaActual - 1) * this.tamañoPagina;
    const fin = inicio + this.tamañoPagina;
    this.transitosPaginados = this.transitosFiltrados.slice(inicio, fin);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPagina();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPagina();
    }
  }
}
