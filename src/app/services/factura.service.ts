import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private baseUrl = 'http://localhost:8080/api/facturacion';

  constructor(private http: HttpClient) {}

  obtenerFacturasPorCliente(idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cliente/${idCliente}`);
  }

  descargarFacturaPDF(idFactura: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/pdf/${idFactura}`, { responseType: 'blob' });
  }


  obtenerFacturasFiltradas(idCliente: number, fechaDesde?: string, fechaHasta?: string, nroContrato?: string) {
        let params: any = { idCliente };

        if (fechaDesde) params.fechaDesde = fechaDesde;
        if (fechaHasta) params.fechaHasta = fechaHasta;
        if (nroContrato) params.nroContrato = nroContrato;

        return this.http.get<any[]>(`${this.baseUrl}/filtrar`, { params });
    }   
}
