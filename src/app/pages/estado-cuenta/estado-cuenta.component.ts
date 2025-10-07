import { Component, OnInit } from '@angular/core';
import { EstadoCuentaService } from '../../services/estado-cuenta.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


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
  movimientosPaginados: any[] = [];
  paginaActual: number = 1;
  tamañoPagina: number = 10;
  totalPaginas: number = 1;


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

    const periodo = this.periodoSeleccionado.replace('-', '');

    if (this.tipoSeleccionado === 'PRE') {
      this.estadoCuentaService.getPrepagoResumen(this.contratoSeleccionado, periodo)
        .subscribe(resumen => {
          this.estadoCuenta = resumen;
          this.estadoCuenta.movimientos = [];

          this.estadoCuentaService.getPrepagoMovimientos(this.contratoSeleccionado, periodo)
            .subscribe(movs => {
              this.estadoCuenta.movimientos = movs;
              this.totalPaginas = Math.ceil(movs.length / this.tamañoPagina);
              this.actualizarPagina();
            });
        });
    } else {
      this.estadoCuentaService.getPospagoResumen(this.contratoSeleccionado, periodo)
        .subscribe(resumen => {
          this.estadoCuenta = resumen;
          this.estadoCuenta.detalles = [];

          this.estadoCuentaService.getPospagoMovimientos(this.contratoSeleccionado, periodo)
            .subscribe(det => {
              this.estadoCuenta.detalles = det;
              this.totalPaginas = Math.ceil(det.length / this.tamañoPagina);
              this.actualizarPagina();
            });
        });
    }
  }


  //Exportar reporte Excel y PDF

  exportarExcel(): void {
    let data: any[] = [];

    if (this.tipoSeleccionado === 'PRE') {
      data = this.estadoCuenta?.movimientos || [];
    } else if (this.tipoSeleccionado === 'POS') {
      data = this.estadoCuenta?.detalles || [];
    }

    // Generar hoja Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'EstadoCuenta');

    // Descargar archivo
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'estado_cuenta.xlsx');
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Estado de Cuenta - SmartPass', 14, 20);

    if (this.tipoSeleccionado === 'PRE') {
      autoTable(doc, {
        head: [['Fecha', 'Tipo', 'Descripción', 'Monto']],
        body: this.estadoCuenta?.movimientos.map((m: any) => [
          m.fecha, m.tipo, m.descripcion, m.monto
        ]) || []
      });
    } else if (this.tipoSeleccionado === 'POS') {
      autoTable(doc, {
        head: [['Número', 'Fecha', 'Total', 'Estado']],
        body: this.estadoCuenta?.detalles.map((d: any) => [
          d.numeroFactura, d.fechaEmision, d.total, d.estado
        ]) || []
      });
    }

   doc.save('estado_cuenta.pdf');
  }

  actualizarPagina(): void {
    const inicio = (this.paginaActual - 1) * this.tamañoPagina;
    const fin = inicio + this.tamañoPagina;

    if (this.tipoSeleccionado === 'PRE') {
      this.movimientosPaginados = this.estadoCuenta?.movimientos?.slice(inicio, fin) || [];
    } else {
      this.movimientosPaginados = this.estadoCuenta?.detalles?.slice(inicio, fin) || [];
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPagina();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPagina();
    }
}




}
