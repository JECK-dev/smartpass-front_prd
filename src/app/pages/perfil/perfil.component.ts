import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  modoEdicion = false;

  perfil = {
    tipo: 'Empresa', // o 'Individual'
    nombre: 'SmartPass SAC',
    documento: '20604588951',
    correo: 'contacto@smartpass.pe',
    telefono: '+51 987 654 321'
  };

  perfilEditado = { ...this.perfil };

  constructor() {}

  ngOnInit(): void {}

  habilitarEdicion(): void {
    this.modoEdicion = true;
    this.perfilEditado = { ...this.perfil };
  }

  guardarCambios(): void {
    this.perfil = { ...this.perfilEditado };
    this.modoEdicion = false;
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
  }
}