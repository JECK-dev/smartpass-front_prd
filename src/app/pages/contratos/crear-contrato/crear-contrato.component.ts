import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContratoService } from '../../../services/contrato.service';
import { Router } from '@angular/router';
import { Contrato } from '../../../models/contrato.model';

@Component({
  selector: 'app-crear-contrato',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-contrato.component.html',
  styleUrls: ['./crear-contrato.component.css']
})
export class CrearContratoComponent implements OnInit {

  
  contrato: any = {
    tipoPago: '',
    fechaCreacion: this.obtenerFechaActual(),
    idTipoFactura: 1 // valor por defecto = Factura
  };

  nombreUsuario: string = '';

  constructor(
    private contratoService: ContratoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nombreUsuario = localStorage.getItem('nombreUsuario') || '';
  }

  guardarContrato(): void {
    const idCliente = parseInt(localStorage.getItem('idCliente') || '0', 10);

    if (!idCliente) {
      alert('Debe iniciar sesión para registrar un contrato.');
      this.router.navigate(['/login']);
      return;
    }

    const tipoContrato = this.construirTipoContrato();

    const nuevoContrato: Partial<Contrato> = {
      idCliente: idCliente,
      saldo: 0,
      tipoContrato: tipoContrato,
      fechaCreacion: new Date(this.contrato.fechaCreacion).toISOString(),
      fechaModificacion: new Date().toISOString(),
      idEstado: 1,
      idTipoFactura: Number( this.contrato.idTipoFactura)
    };

    console.log('Contrato a enviar:', nuevoContrato); // 👀 ver en consola

    this.contratoService.crearContrato(nuevoContrato).subscribe({
      next: () => {
        alert('Contrato creado exitosamente');
        this.router.navigate(['/listar-contrato']);
      },
      error: (err) => {
        console.error('Error al crear contrato:', err);
        alert('Hubo un problema al crear el contrato.');
      }
    });
  }

  obtenerFechaActual(): string {
    return new Date().toISOString().split('T')[0];
  }

  construirTipoContrato(): string {
    if (this.contrato.tipoPago === 'Prepago') return 'PRE';
    if (this.contrato.tipoPago === 'Pospago') return 'POS';
    return '';
  }
}