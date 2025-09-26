import { Component, OnInit } from '@angular/core';
import { EstadoCuentaService } from '../../services/estado-cuenta.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estado-cuenta',
  imports: [CommonModule,FormsModule],
  templateUrl: './estado-cuenta.component.html',
  styleUrl: './estado-cuenta.component.css'
})
export class EstadoCuentaComponent implements OnInit {

  contratos: any[] = [1, 2, 3]; // ⚠️ Aquí deberías traer contratos reales del back
  contratoSeleccionado!: number;
  periodoSeleccionado!: string;
  tipoSeleccionado: string = 'PRE'; // PRE o POS

  estadoCuenta: any = null;

  constructor(private estadoCuentaService: EstadoCuentaService) {}

  cargarContratos() {
  if (this.tipoSeleccionado) {
    this.estadoCuentaService.getContratosPorTipo(this.tipoSeleccionado)
      .subscribe(data => {
        this.contratos = data;
      });
  }
}

  ngOnInit(): void {
    this.cargarContratos();
  }

  buscarEstadoCuenta() {
    if (!this.contratoSeleccionado || !this.periodoSeleccionado) return;

    if (this.tipoSeleccionado === 'PRE') {
      this.estadoCuentaService.getPrepago(this.contratoSeleccionado, this.periodoSeleccionado)
        .subscribe(data => {
          if (data && data.length > 0) {
            this.estadoCuenta = data[0];   // ✅ tomar el primer objeto
            this.estadoCuenta.movimientos = []; // ⚠️ vacío, hasta que consultes los detalles
          }
        });
    } else {
      this.estadoCuentaService.getPospago(this.contratoSeleccionado, this.periodoSeleccionado)
        .subscribe(data => {
          if (data && data.length > 0) {
            this.estadoCuenta = data[0];
            this.estadoCuenta.detalles = []; // ⚠️ vacío, hasta que consultes los detalles
          }
        });
    }
  }

}
