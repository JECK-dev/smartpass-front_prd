import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RegistroRequest,Usuario,Cliente } from '../../models/registro.model';
import { RegistroService } from '../../services/registro.service';




@Component({
  selector: 'app-registro-empresa',
  imports: [],
  templateUrl: './registro-empresa.component.html',
  styleUrl: './registro-empresa.component.css'
})
export class RegistroEmpresaComponent {
  constructor(
    private registroService: RegistroService,
    private router: Router
  ) {}

  registrarEmpresa(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const ruc = (document.getElementById('ruc') as HTMLInputElement).value.trim();
    const razonSocial = (document.getElementById('razonSocial') as HTMLInputElement).value.trim();
    const correo = (document.getElementById('correoEmpresa') as HTMLInputElement).value.trim();
    const telefonoStr = (document.getElementById('telefonoEmpresa') as HTMLInputElement).value.trim();
    const telefono = telefonoStr ? parseInt(telefonoStr, 10) : 0;
    const representante = (document.getElementById('representante') as HTMLInputElement).value.trim();
    const dniRepresentante = (document.getElementById('dniRepresentante') as HTMLInputElement).value.trim();
    const passwordInput = document.getElementById('passwordEmpresa') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirmarPasswordEmpresa') as HTMLInputElement;

    // 🔹 Validar coincidencia de contraseñas
    if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.setCustomValidity("Las contraseñas no coinciden");
    } else {
      confirmPasswordInput.setCustomValidity("");
    }

    // 🔹 Validación de formulario
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // 🔹 Construir cliente
    const cliente: Cliente = {
      nombre: razonSocial,
      apellido: 'SAC',   // o podrías dejarlo vacío si tu modelo lo permite
      numDocumento: ruc,
      telefono,
      correo
    };

    // 🔹 Construir usuario
    const usuario: Usuario = {
      nombre: representante,
      apellido: '', // o separar nombre/apellido real
      dni: dniRepresentante,
      numTelefono: telefono,
      usuario: correo,
      password: passwordInput.value
    };

    // 🔹 Payload final
    const payload: RegistroRequest = { cliente, usuario };

    // 🔹 Llamada al servicio
    this.registroService.registrarEmpresa(payload).subscribe({
      next: () => {
        alert('Registro empresarial exitoso.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar empresa:', err);
        alert('Error en el registro. Verifica los datos.');
      }
    });
  }
}


