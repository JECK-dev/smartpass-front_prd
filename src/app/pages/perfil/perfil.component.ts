import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PerfilService } from '../../services/perfil.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  @ViewChild('perfilForm') perfilForm!: NgForm;

  perfil: any = {};
  perfilEditado: any = {};
  modoEdicion = false;
  idCliente = 0;
  correoInvalido = false;

  constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    const id = localStorage.getItem('idCliente');
    this.idCliente = id ? Number(id) : 0;
    if (this.idCliente > 0) this.obtenerPerfil();
  }

  obtenerPerfil(): void {
    this.perfilService.obtenerPerfil(this.idCliente).subscribe({
      next: (data) => {
        this.perfil = data;
        this.perfilEditado = { ...data };
      },
      error: (err) => {
        console.error('Error al obtener perfil:', err);
        alert('No se pudo obtener la información del perfil.');
      }
    });
  }

  habilitarEdicion(): void {
    this.modoEdicion = true;
    this.perfilEditado = { ...this.perfil };
    setTimeout(() => {
      if (this.perfilForm) this.perfilForm.resetForm(this.perfilEditado);
    }, 0);
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.perfilEditado = { ...this.perfil };
    this.correoInvalido = false;
    if (this.perfilForm) this.perfilForm.resetForm(this.perfilEditado);
  }

  validarCorreo(event?: Event): void {
    const valor = event ? (event.target as HTMLInputElement).value : (this.perfilEditado?.correo ?? '');
    const arrobas = (valor.match(/@/g) || []).length;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.correoInvalido = arrobas !== 1 || !emailRegex.test(valor);
    console.log('validarCorreo ->', { valor, arrobas, correoInvalido: this.correoInvalido });
  }

  soloNumeros(event: KeyboardEvent): void {
    const char = event.key;
    if (!/^\d$/.test(char)) {
      event.preventDefault();
    }
  }

  guardarCambios(form: NgForm): void {
    if (form && form.control) form.control.markAllAsTouched();

    console.log('--- guardarCambios ---');
    console.log('form.valid =', form.valid, 'form.invalid =', form.invalid);
    console.log('form.value =', form.value);

    const respaldoOk = this.validarCampos();
    console.log('validarCampos() =>', respaldoOk, 'correoInvalido=', this.correoInvalido);

    const tieneControles = form && Object.keys(form.controls).length > 0;

    // Si algo no pasa la validación, avisar al usuario
    if ((tieneControles && form.invalid) || this.correoInvalido || !respaldoOk) {
      let mensaje = 'Por favor, complete los campos correctamente.';
      if (this.correoInvalido) mensaje = 'El correo contiene un formato inválido o más de un @.';

      // Mostrar campos inválidos en consola
      const invalidos = Object.keys(form.controls)
        .filter(k => form.controls[k].invalid)
        .join(', ');
      console.warn('Campos inválidos:', invalidos);

      alert(mensaje);
      return;
    }

    // Si todo OK → enviar al backend
    this.perfilService.actualizarPerfil(this.idCliente, this.perfilEditado).subscribe({
      next: (data) => {
        this.perfil = data;
        this.modoEdicion = false;
        alert('Perfil actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        alert('Ocurrió un error al actualizar el perfil.');
      }
    });
  }

  validarCampos(): boolean {
    const { nombre, apellido, correo, telefono } = this.perfilEditado || {};

    // Validaciones básicas
    if (!nombre?.toString().trim()) return false;
    if (!apellido?.toString().trim()) return false;
    if (!correo?.toString().trim()) return false;
    if (!telefono?.toString().trim()) return false;

    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const arrobas = (correo.match(/@/g) || []).length;
    if (!emailRegex.test(correo) || arrobas !== 1) {
      this.correoInvalido = true;
      return false;
    } else {
      this.correoInvalido = false;
    }

    // Validar teléfono (9 dígitos exactos)
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(telefono)) {
      console.log('validarCampos: teléfono inválido', telefono);
      return false;
    }

    return true;
  }
}
