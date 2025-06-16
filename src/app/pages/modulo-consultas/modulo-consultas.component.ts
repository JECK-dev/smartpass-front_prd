import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modulo-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modulo-consultas.component.html',
  styleUrls: ['./modulo-consultas.component.css']
})
export class ModuloConsultasComponent {
  consulta = {
    tipo: '',
    detalle: ''
  };
  mensaje = '';

  enviarConsulta() {
    this.mensaje = `Su ${this.consulta.tipo} ha sido registrada correctamente.`;
    this.consulta = { tipo: '', detalle: '' };
  }

}
