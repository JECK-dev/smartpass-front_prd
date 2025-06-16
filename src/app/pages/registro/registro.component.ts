import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cliente, RegistroRequest, Usuario } from '../../models/registro.model';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-registro',
  imports: [],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  constructor(
    private registroService: RegistroService,
    private router: Router
  ) {}

  registrarUsuario(event: Event): void {
    event.preventDefault();

    // Capturar valores del formulario
    const nombre = (document.getElementById('firstName') as HTMLInputElement).value.trim();
    const apellido = (document.getElementById('lastName') as HTMLInputElement).value.trim();
    const numDocumento = (document.getElementById('nroDocumento') as HTMLInputElement).value.trim();
    const telefono = parseInt((document.getElementById('phoneNumber') as HTMLInputElement).value, 10);
    const correo = (document.getElementById('emailAddress') as HTMLInputElement).value.trim();
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Crear los objetos según el modelo
    const cliente: Cliente = {
      nombre,
      apellido,
      numDocumento,
      telefono,
      correo
    };

    const usuario: Usuario = {
      nombre,
      apellido,
      dni: numDocumento,
      numTelefono: telefono,
      usuario: correo,
      password
    };

    const payload: RegistroRequest = { cliente, usuario };

    // Llamar al servicio
    this.registroService.registrarIndividual(payload).subscribe({
      next: () => {
        alert('Registro exitoso.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        alert('Ocurrió un error al registrar. Verifica que no estés usando un correo o documento ya registrados.');
      }
    });
  }


}
