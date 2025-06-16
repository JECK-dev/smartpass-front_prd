import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent {

  correo: string = '';
  mensaje: string = '';

  enviarRecuperacion() {
    this.mensaje = `Se ha enviado un enlace de recuperación a ${this.correo}`;
    this.correo = '';
  }

}
