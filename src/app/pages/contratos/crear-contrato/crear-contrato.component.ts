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
    idContrato: this.generarId(),
    tipoPago: '',
    subtipoContrato: '',
    fechaCreacion: this.obtenerFechaActual()
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
      saldo: tipoContrato === 'PRE' ? 0 : 0,
      tipoContrato: tipoContrato,
      fechaCreacion: new Date(this.contrato.fechaCreacion).toISOString(),
      fechaModificacion: new Date().toISOString(),
      idEstado: 1
    };

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

  generarId(): number {
    return Math.floor(1000 + Math.random() * 9000);
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
