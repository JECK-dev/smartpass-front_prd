import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contrato, RecargaRequest, TransaccionSaldo } from '../../../models/recarga.model';
import { RecargaService } from '../../../services/recarga.service';

@Component({
  selector: 'app-recarga',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recarga.component.html',
  styleUrls: ['./recarga.component.css']
})
export class RecargaComponent  implements OnInit {

  recarga: RecargaRequest = {
    idContrato: 0,
    monto: 0,
    medioPago: 0,
    descripcion: ''
  };

  metodoSeleccionado: string = '';
  contratosPrepago: Contrato[] = [];
  transacciones: TransaccionSaldo[] = [];
  transaccionesPaginadas: TransaccionSaldo[] = [];
  paginaActual: number = 1;
  tamañoPagina: number = 10;
  totalPaginas: number = 1;

  

  metodosPago = [
    { codigo: 'Yape', nombre: 'Yape', logo: 'assets/yape.png' },
    { codigo: 'Plin', nombre: 'Plin', logo: 'assets/plin.jpeg' },
    { codigo: 'Visa', nombre: 'Visa', logo: 'assets/visa.jpg' },
    { codigo: 'PagoEfectivo', nombre: 'PagoEfectivo', logo: 'assets/pagoEfectivo.png' }
  ];

  constructor(private recargaService: RecargaService) {}

  ngOnInit(): void {
    this.cargarContratosPrepago();
  }

  cargarContratosPrepago(): void {
    const idCliente = localStorage.getItem('idCliente');
    if (!idCliente) return;

    this.recargaService.getContratosPrepagoPorCliente(+idCliente).subscribe(data => {
      this.contratosPrepago = data;
    });
  }

  seleccionarMetodo(codigo: string): void {
    this.metodoSeleccionado = codigo;
    this.recarga.medioPago = this.obtenerCodigoMetodo(codigo);
    this.recarga.descripcion = `Recarga con ${codigo}`;
  }

  obtenerCodigoMetodo(nombre: string): number {
    switch (nombre) {
      case 'Yape': return 1;
      case 'Plin': return 2;
      case 'Visa': return 3;
      case 'PagoEfectivo': return 4;
      default: return 0;
    }
  }

  recargarSaldo(): void {
    this.recargaService.realizarRecarga(this.recarga).subscribe(response => {
      alert(response);
      this.obtenerTransacciones(this.recarga.idContrato);
    });
  }

  onContratoSeleccionado(): void {
    if (this.recarga.idContrato) {
      this.obtenerTransacciones(this.recarga.idContrato);
    } else {
      this.transacciones = [];
    }
  }

  obtenerTransacciones(idContrato: number): void {
    this.recargaService.getTransaccionesPorContrato(idContrato).subscribe(data => {
      this.transacciones = data;
      this.totalPaginas = Math.ceil(this.transacciones.length / this.tamañoPagina);
      this.actualizarPagina();
    });
  }

  actualizarPagina(): void {
    const inicio = (this.paginaActual - 1) * this.tamañoPagina;
    const fin = inicio + this.tamañoPagina;
    this.transaccionesPaginadas = this.transacciones.slice(inicio, fin);
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