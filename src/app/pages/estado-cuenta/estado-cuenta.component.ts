import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EstadoCuenta } from '../../models/estado-cuenta.model';
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

  // Tu HTML espera contratos: string[] (códigos)
  contratos: string[] = [];
  // Y guarda el string elegido aquí:
  contratoSeleccionado: string | null = null;

  // Tu HTML usa input month
  periodoSeleccionado = ''; // "YYYY-MM"

  // Donde pintas el resultado
  estadoCuenta: any = null;

  // Filtro opcional (tu HTML no lo envía aún)
  buscarTerm = '';

  cargando = false;
  errorMsg = '';

  // Mapa interno para traducir código -> id
  private codigoToId: Record<string, number> = {};

  @ViewChild('filtro') filtroInput!: ElementRef<HTMLInputElement>;

  constructor(private svc: EstadoCuentaService) {}

  ngOnInit(): void {
    const idclienteStr = localStorage.getItem('idcliente');
    const idcliente = idclienteStr ? Number(idclienteStr) : null;

    if (!idcliente) {
      this.errorMsg = 'No se encontró idcliente en localStorage.';
      return;
    }

    // Trae [{id, codigo}] y construye tu contratos: string[] + mapa
    this.svc.getContratos(idcliente).subscribe({
      next: (rows) => {
        this.contratos = rows.map(r => String(r.codigo)); // <- lo que tu HTML muestra y selecciona
        this.codigoToId = {};
        for (const r of rows) this.codigoToId[String(r.codigo)] = r.id;
      },
      error: (e) => {
        this.errorMsg = 'No se pudieron cargar los contratos';
        console.error(e);
      }
    });
  }

  buscarEstadoCuenta(): void {
    this.errorMsg = '';
    if (!this.contratoSeleccionado || !this.periodoSeleccionado) {
      this.errorMsg = 'Selecciona contrato y periodo.';
      return;
    }
    const contratoId = this.codigoToId[this.contratoSeleccionado];
    if (!contratoId) {
      this.errorMsg = 'No se encontró el id del contrato seleccionado.';
      return;
    }

    this.cargando = true;
    this.svc.getEstadoCuenta(contratoId, this.periodoSeleccionado, this.buscarTerm, 0, 200)
      .subscribe({
        next: (res) => { this.estadoCuenta = res; this.cargando = false; },
        error: (e) => {
          this.errorMsg = 'Error al obtener el estado de cuenta.';
          this.cargando = false;
          console.error(e);
        }
      });
  }

  // Por si luego conectas (input)="aplicarFiltro(filtro.value)"
  aplicarFiltro(valor: string): void {
    this.buscarTerm = valor || '';
    // Si quieres búsqueda en vivo, descomenta:
    // this.buscarEstadoCuenta();
  }
  /*
  descargarPDF(): void {
    if (!this.estadoCuenta?.idEstadoCuenta) return;
    this.svc.descargarPdf(this.estadoCuenta.idEstadoCuenta)
      .subscribe(blob => this.bajar(blob, `estado_cuenta_${this.estadoCuenta.idEstadoCuenta}.pdf`));
  }

  descargarExcel(): void {
    if (!this.estadoCuenta?.idEstadoCuenta) return;
    this.svc.descargarExcel(this.estadoCuenta.idEstadoCuenta)
      .subscribe(blob => this.bajar(blob, `estado_cuenta_${this.estadoCuenta.idEstadoCuenta}.xlsx`));
  }

  private bajar(blob: Blob, nombre: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = nombre; a.click();
    URL.revokeObjectURL(url);
  }*/
}