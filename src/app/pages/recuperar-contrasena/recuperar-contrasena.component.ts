import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
  cargando: boolean = false;

  constructor(private authService: AuthService) {}

  enviarRecuperacion() {
    if (!this.correo) {
      this.mensaje = 'Por favor ingrese un correo válido';
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    this.authService.forgotPassword(this.correo).subscribe({
      next: (res) => {
        this.mensaje = 'Se ha enviado un enlace a tu correo electrónico. Revisa tu bandeja de entrada.';
        this.cargando = false;
      },
      error: (err) => {
        this.mensaje = 'Error: ' + (err.error?.message || 'No se pudo procesar la solicitud');
        this.cargando = false;
      }
    });
  }
}
