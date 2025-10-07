import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FacturaService } from '../../../services/factura.service';

@Component({
  selector: 'app-lista-facturas',
  imports: [FormsModule, CommonModule],
  templateUrl: './lista-facturas.component.html',
  styleUrl: './lista-facturas.component.css'
})
export class ListaFacturasComponent implements OnInit {
  
  facturas: any[] = [];
  idCliente: number = 0;
  facturasPaginadas: any[] = [];
  paginaActual: number = 1;
  tamañoPagina: number = 15;
  totalPaginas: number = 1;


  

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.idCliente= Number(localStorage.getItem('idCliente'));

    this.obtenerFacturas(); // inicial

  }

  obtenerFacturas() {
    this.facturaService.obtenerFacturasPorCliente(this.idCliente).subscribe({
      next: data => {
      this.facturas = data;
      this.totalPaginas = Math.ceil(this.facturas.length / this.tamañoPagina);
      this.actualizarPagina();
    },
      error: err => console.error('Error al obtener facturas', err)
    });
  }

  descargar(serie: number, correlativo: string): void {
    this.facturaService.descargarFactura(serie, correlativo).subscribe(blob => {
      const filename = `F${serie}-${correlativo}.pdf`;

      // Crear URL y descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al descargar la factura', error);
      alert('No se pudo descargar la factura');
    });
  }

  actualizarPagina(): void {
  const inicio = (this.paginaActual - 1) * this.tamañoPagina;
  const fin = inicio + this.tamañoPagina;
  this.facturasPaginadas = this.facturas.slice(inicio, fin);
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