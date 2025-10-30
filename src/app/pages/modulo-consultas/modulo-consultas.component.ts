import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ConsultasService } from '../../services/consultas.service';
import { TipoReclamo } from '../../models/tiporeclamo.model';
import { Vehiculo } from '../../models/vehiculio.model';
import { ReclamoCreate } from '../../models/reclamo-create.model';

@Component({
  selector: 'app-modulo-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modulo-consultas.component.html',
  styleUrls: ['./modulo-consultas.component.css']
})
export class ModuloConsultasComponent implements OnInit {

  tiposReclamo: TipoReclamo[] = [];
  vehiculos: Vehiculo[] = [];

  consulta: ReclamoCreate = {
    idCliente: 0,
    idVehiculo: 0 as any,
    idTipoReclamo: 0 as any,
    detalle: ''
  };

  archivoSeleccionado: File | null = null;
  contador = 0;
  isSubmitting = false;
  progreso = 0; // 📊 progreso de carga
  mensaje = '';
  error = '';

  constructor(private consultasSrv: ConsultasService) {}

  ngOnInit(): void {
    const idCliente = Number(localStorage.getItem('idCliente'));
    this.consulta.idCliente = idCliente ? Number(idCliente) : 0;

    // Cargar tipos de reclamo
    this.consultasSrv.getTiposReclamo().subscribe({
      next: (data) => (this.tiposReclamo = data),
      error: () => (this.error = 'No se pudieron cargar los tipos de reclamo.')
    });

    // Cargar vehículos del cliente
    this.consultasSrv.getVehiculosCliente(this.consulta.idCliente).subscribe({
      next: (data) => (this.vehiculos = data),
      error: () => (this.error = 'No se pudieron cargar los vehículos del cliente.')
    });
  }

  // 📁 Captura del archivo seleccionado
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      this.mensaje = '';
      this.error = '';
    }
  }

  // 📤 Envío de la consulta con posible archivo adjunto
  enviarConsulta(form: any): void {
    this.mensaje = '';
    this.error = '';

    if (!form.valid) return;

    this.isSubmitting = true;
    this.progreso = 0;

    // Construcción del FormData
    const formData = new FormData();
    formData.append('idCliente', this.consulta.idCliente.toString());
    formData.append('idVehiculo', this.consulta.idVehiculo.toString());
    formData.append('idTipoReclamo', this.consulta.idTipoReclamo.toString());
    formData.append('detalle', this.consulta.detalle);
    formData.append('estado', '1');

    if (this.archivoSeleccionado) {
      formData.append('archivo', this.archivoSeleccionado);
    }

    // Llamar al servicio con seguimiento de progreso
    this.consultasSrv.crearReclamo(formData).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progreso = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.mensaje = '✅ Tu consulta/reclamo fue registrado correctamente.';
          this.isSubmitting = false;
          this.progreso = 0;
          form.resetForm();
          this.archivoSeleccionado = null;
        }
      },
      error: () => {
        this.error = '❌ Ocurrió un error al registrar tu consulta. Intenta nuevamente.';
        this.isSubmitting = false;
        this.progreso = 0;
      }
    });
  }
}
