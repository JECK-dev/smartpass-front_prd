import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recarga',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recarga.component.html',
  styleUrls: ['./recarga.component.css']
})
export class RecargaComponent {

  contratosPrepago = [
    { id: 1, codigo: 'C-001', cliente: 'Empresa Alpha' },
    { id: 2, codigo: 'C-003', cliente: 'Transportes XYZ' }
  ];

  metodosPago = [
    { codigo: 'yape', nombre: 'Yape', logo: 'assets/yape.png' },
    { codigo: 'plin', nombre: 'Plin', logo: 'assets/plin.jpeg' },
    { codigo: 'visa', nombre: 'Visa', logo: 'assets/visa.jpg' },
    { codigo: 'pagoefectivo', nombre: 'PagoEfectivo', logo: 'assets/pagoEfectivo.png' }
  ];

  recarga = {
    idContrato: '',
    monto: 0,
    metodo: ''
  };

  seleccionarMetodo(codigo: string) {
    this.recarga.metodo = codigo;
  }

  recargarSaldo() {
    console.log('Recarga:', this.recarga);
    alert(`Recarga exitosa para contrato ${this.recarga.idContrato} por S/ ${this.recarga.monto}`);
    this.recarga = { idContrato: '', monto: 0, metodo: '' };
  }

}
