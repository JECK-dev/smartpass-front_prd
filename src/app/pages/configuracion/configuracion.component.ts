import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { ConfiguracionService, UserSettings } from '../../services/configuration.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent implements OnInit {

  // === Deben existir porque tu HTML los usa con [(ngModel)] ===
  notificaciones = { correo: false, telefono: false };
  cambioContrasena = { actual: '', nueva: '', confirmar: '' };
  idioma: 'es' | 'en' = 'es';
  modoOscuro = false;

  guardando = false;

  constructor(private cfg: ConfiguracionService) {}

  ngOnInit(): void {
    this.cfg.cargarPreferencias().subscribe((s: UserSettings) => {
      this.notificaciones = { correo: !!s.notifCorreo, telefono: !!s.notifTelefono };
      this.idioma = (s.idioma as 'es' | 'en') ?? 'es';
      this.modoOscuro = !!s.modoOscuro;
    });
  }

  guardarCambios(): void {
    this.guardando = true;

    const prefs: UserSettings = {
      notifCorreo: this.notificaciones.correo,
      notifTelefono: this.notificaciones.telefono,
      idioma: this.idioma,
      modoOscuro: this.modoOscuro
    };

    const operaciones: Observable<unknown>[] = [ this.cfg.guardarPreferencias(prefs) ];

    const { actual, nueva, confirmar } = this.cambioContrasena;
    const quiereCambiarPwd = !!(actual || nueva || confirmar);

    if (quiereCambiarPwd) {
      const userId = this.cfg.getUsuarioId(); // lee de localStorage; fallback 1
      operaciones.push(this.cfg.cambiarPassword(userId, actual, nueva, confirmar));
    }

    forkJoin(operaciones).subscribe({
      next: () => {
        if (quiereCambiarPwd) this.cambioContrasena = { actual: '', nueva: '', confirmar: '' };
        alert('Cambios guardados correctamente.');
        this.guardando = false;
      },
      error: (e: unknown) => {
        console.error(e);
        alert('No se pudo cambiar la contraseña, por favor ingresar contraseña correcta');
        this.guardando = false;
      }
    });
  }
}