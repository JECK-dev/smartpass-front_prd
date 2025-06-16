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

    const ruc = (document.getElementById('ruc') as HTMLInputElement).value.trim();
    const razonSocial = (document.getElementById('razonSocial') as HTMLInputElement).value.trim();
    const correo = (document.getElementById('correoEmpresa') as HTMLInputElement).value.trim();
    const telefono = parseInt((document.getElementById('telefonoEmpresa') as HTMLInputElement).value, 10);
    const representante = (document.getElementById('representante') as HTMLInputElement).value.trim();
    const password = (document.getElementById('passwordEmpresa') as HTMLInputElement).value;
    const confirmarPassword = (document.getElementById('confirmarPasswordEmpresa') as HTMLInputElement).value;

    if (password !== confirmarPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const cliente: Cliente = {
      nombre: razonSocial,
      apellido: 'SAC',
      numDocumento: ruc,
      telefono,
      correo
    };

    const usuario: Usuario = {
      nombre: representante,
      apellido: representante, // ← Se repite el mismo valor aquí
      dni: ruc,
      numTelefono: telefono,
      usuario: correo,
      password
    };

    const payload: RegistroRequest = { cliente, usuario };

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