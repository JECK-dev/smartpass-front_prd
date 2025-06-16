import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehiculoService } from '../../services/vehiculo.service';

@Component({
  selector: 'app-desafiliacion',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './desafiliacion.component.html',
  styleUrls: ['./desafiliacion.component.css']
})
export class DesafiliacionComponent implements OnInit {
  numeroDocumento: string = '';
  vehiculosFiltrados: any[] = [];
  contratos: any[] = [];
  filtroPlaca: string = '';
  filtroContrato: string = '';

  constructor(private vehiculoService: VehiculoService) {}

  ngOnInit(): void {
    // puedes precargar algo si lo necesitas
  }

  buscarVehiculosPorDocumento(): void {
    if (!this.numeroDocumento.trim()) return;

    this.vehiculoService.obtenerVehiculosPorDocumento(this.numeroDocumento).subscribe({
      next: (vehiculos) => {
        // Solo mostrar vehículos activos
        this.vehiculosFiltrados = vehiculos.filter(v => v.idEstado === 1);
      },
      error: (err) => {
        console.error('Error al buscar vehículos', err);
        this.vehiculosFiltrados = [];
      }
    });
  }

  confirmarDesafiliacion(vehiculo: any): void {
    const confirmacion = window.confirm(`¿Estás seguro de desafiliar la placa ${vehiculo.placa}?`);
    if (confirmacion) {
      this.vehiculoService.desafiliarVehiculo(vehiculo.idVehiculo).subscribe({
        next: () => {
          // Actualizar en UI eliminando o cambiando estado
          this.vehiculosFiltrados = this.vehiculosFiltrados.filter(v => v.idVehiculo !== vehiculo.idVehiculo);
          alert('Vehículo desafiliado exitosamente.');
        },
        error: (err) => {
          console.error('Error al desafiliar vehículo', err);
          alert('Ocurrió un error al desafiliar el vehículo.');
        }
      });
    }
  }

  // Opcional: filtro local por placa o contrato
  get vehiculosFiltradosPorTexto(): any[] {
    return this.vehiculosFiltrados.filter(v =>
      (!this.filtroPlaca || v.placa.toLowerCase().includes(this.filtroPlaca.toLowerCase())) &&
      (!this.filtroContrato || v.idContrato == this.filtroContrato)
    );
  }
}