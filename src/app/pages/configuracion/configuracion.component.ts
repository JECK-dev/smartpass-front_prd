import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent {

  notificaciones = {
    correo: true,
    telefono: false
  };

  cambioContrasena = {
    actual: '',
    nueva: '',
    confirmar: ''
  };

  idioma = 'es';
  modoOscuro = false;

  guardarCambios() {
    // Aquí podrías integrar un servicio para persistir los datos
    console.log('Configuración guardada:', this.notificaciones, this.cambioContrasena, this.idioma, this.modoOscuro);
    alert('Cambios guardados correctamente.');
  }

}
