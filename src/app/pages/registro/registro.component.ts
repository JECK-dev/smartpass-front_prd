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
    const form = event.target as HTMLFormElement;

    // Capturar valores del formulario
    const nombre = (document.getElementById('firstName') as HTMLInputElement).value.trim();
    const apellido = (document.getElementById('lastName') as HTMLInputElement).value.trim();
    const numDocumento = (document.getElementById('nroDocumento') as HTMLInputElement).value.trim();
    const telefonoStr = (document.getElementById('phoneNumber') as HTMLInputElement).value.trim();
    const telefono = telefonoStr ? parseInt(telefonoStr, 10) : 0;
    const correo = (document.getElementById('emailAddress') as HTMLInputElement).value.trim();

    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;

    // 🔹 Validar coincidencia de contraseñas
    if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.setCustomValidity("Las contraseñas no coinciden");
    } else {
      confirmPasswordInput.setCustomValidity("");
    }

    // 🔹 Validación del formulario
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // 🔹 Crear objetos según el modelo
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
      usuario: correo, // correo como username
      password: passwordInput.value
    };

    const payload: RegistroRequest = { cliente, usuario };

    // 🔹 Llamar al servicio
    this.registroService.registrarIndividual(payload).subscribe({
      next: () => {
        alert('Registro exitoso.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);

        if (err.status === 409) {
          // Backend manda el mensaje exacto
          if (err.error?.message?.includes("correo")) {
            alert("El correo ya está registrado en el sistema.");
          } else if (err.error?.message?.includes("documento")) {
            alert("El número de documento ya está registrado en el sistema.");
          } else {
            alert("El correo o documento ya existen.");
          }
        } else if (err.status === 400) {
          alert("Faltan datos obligatorios.");
        } else {
          alert("Error inesperado en el registro. Intente nuevamente.");
        }
      }
    });
  }



}
