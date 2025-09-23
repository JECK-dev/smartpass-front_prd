import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  contador = 0;
  isSubmitting = false;
  mensaje = '';
  error = '';

  constructor(private consultasSrv: ConsultasService) {}

  ngOnInit(): void {
    const idCliente = Number(localStorage.getItem('idCliente'));

    this.consulta.idCliente = idCliente ? Number(idCliente) : 0;

    // Cargar listas
    this.consultasSrv.getTiposReclamo().subscribe({
      next: (data) => this.tiposReclamo = data,
      error: () => this.error = 'No se pudieron cargar los tipos de reclamo.'
    });

    this.consultasSrv.getVehiculosCliente(this.consulta.idCliente).subscribe({
      next: (data) => this.vehiculos = data,
      error: () => this.error = 'No se pudieron cargar los vehículos del cliente.'
    });
  }

  enviarConsulta(form: any): void {
    this.mensaje = '';
    this.error = '';

    if (!form.valid) { return; }

    this.isSubmitting = true;

    const payload = {
      cliente: { idCliente: this.consulta.idCliente },
      vehiculo: { idVehiculo: this.consulta.idVehiculo },
      tipoReclamo: { idTipoReclamo: this.consulta.idTipoReclamo },
      detalle: this.consulta.detalle,
      estado: 1
    };

    this.consultasSrv.crearReclamo(payload).subscribe({
      next: () => {
        this.mensaje = 'Tu consulta/reclamo fue registrado correctamente.';
        this.isSubmitting = false;
        form.resetForm();
        this.contador = 0;
      },
      error: () => {
        this.error = 'Ocurrió un error al registrar tu consulta. Intenta nuevamente.';
        this.isSubmitting = false;
      }
    });
  }
}
